from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profil, Categorie, Plat, Commande, CommandeItem

class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    telephone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'telephone']

    def create(self, validated_data):
        telephone = validated_data.pop('telephone', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        Profil.objects.create(user=user, role='client', telephone=telephone)
        return user

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']

    def get_role(self, obj):
        if obj.is_superuser:
            return 'admin'
        try:
            return obj.profil.role
        except:
            return 'client'

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class PlatSerializer(serializers.ModelSerializer):
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)
    categorie_icone = serializers.CharField(source='categorie.icone', read_only=True)

    class Meta:
        model = Plat
        fields = '__all__'

class CommandeItemSerializer(serializers.ModelSerializer):
    plat_nom = serializers.CharField(source='plat.nom', read_only=True)
    sous_total = serializers.SerializerMethodField()

    class Meta:
        model = CommandeItem
        fields = '__all__'

    def get_sous_total(self, obj):
        return obj.sous_total()

class CommandeSerializer(serializers.ModelSerializer):
    items = CommandeItemSerializer(many=True, read_only=True)
    client_nom = serializers.SerializerMethodField()
    client_username = serializers.CharField(source='client.username', read_only=True)

    class Meta:
        model = Commande
        fields = '__all__'

    def get_client_nom(self, obj):
        return f"{obj.client.first_name} {obj.client.last_name}".strip() or obj.client.username

class CommandeCreateSerializer(serializers.Serializer):
    items = serializers.ListField(child=serializers.DictField())
    notes = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        user = self.context['request'].user
        items_data = validated_data.get('items', [])
        notes = validated_data.get('notes', '')
        commande = Commande.objects.create(client=user, notes=notes)
        for item in items_data:
            plat = Plat.objects.get(id=item['plat_id'])
            CommandeItem.objects.create(
                commande=commande,
                plat=plat,
                quantite=item['quantite'],
                prix_unitaire=plat.prix
            )
        commande.calculer_total()
        return commande