from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Profil, Categorie, Plat, Commande, CommandeItem
from .serializers import (InscriptionSerializer, UserSerializer, CategorieSerializer,
                          PlatSerializer, CommandeSerializer, CommandeCreateSerializer)

@api_view(['POST'])
@permission_classes([AllowAny])
def inscription(request):
    serializer = InscriptionSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def connexion(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        if not hasattr(user, 'profil'):
            Profil.objects.create(user=user, role='admin' if user.is_superuser else 'client')
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    return Response({'error': 'Identifiants incorrects'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mon_profil(request):
    return Response(UserSerializer(request.user).data)

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

class PlatViewSet(viewsets.ModelViewSet):
    serializer_class = PlatSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Plat.objects.all()
        is_admin = user.is_authenticated and (user.is_superuser or
                   (hasattr(user, 'profil') and user.profil.role == 'admin'))
        if not is_admin:
            queryset = queryset.filter(disponible=True)
        categorie = self.request.query_params.get('categorie')
        if categorie:
            queryset = queryset.filter(categorie_id=categorie)
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

class CommandeViewSet(viewsets.ModelViewSet):
    serializer_class = CommandeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        is_admin = user.is_superuser or (hasattr(user, 'profil') and user.profil.role == 'admin')
        if is_admin:
            return Commande.objects.all().order_by('-created_at')
        return Commande.objects.filter(client=user).order_by('-created_at')

    def create(self, request):
        serializer = CommandeCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            commande = serializer.save()
            return Response(CommandeSerializer(commande).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def changer_statut(self, request, pk=None):
        commande = self.get_object()
        user = request.user
        is_admin = user.is_superuser or (hasattr(user, 'profil') and user.profil.role == 'admin')
        if not is_admin:
            return Response({'error': 'Permission refusee'}, status=status.HTTP_403_FORBIDDEN)
        commande.statut = request.data.get('statut')
        commande.save()
        return Response(CommandeSerializer(commande).data)

    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        user = request.user
        is_admin = user.is_superuser or (hasattr(user, 'profil') and user.profil.role == 'admin')
        if not is_admin:
            return Response({'error': 'Permission refusee'}, status=status.HTTP_403_FORBIDDEN)
        from django.utils import timezone
        from django.db.models import Sum
        return Response({
            'en_attente': Commande.objects.filter(statut='en_attente').count(),
            'en_preparation': Commande.objects.filter(statut='en_preparation').count(),
            'livrees': Commande.objects.filter(statut='livre').count(),
            'revenus': Commande.objects.filter(statut='livre').aggregate(t=Sum('total'))['t'] or 0,
            'total_plats': Plat.objects.filter(disponible=True).count(),
            'total_clients': User.objects.filter(profil__role='client').count(),
        })