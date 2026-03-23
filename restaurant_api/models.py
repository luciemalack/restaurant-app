from django.db import models
from django.contrib.auth.models import User

class Profil(models.Model):
    ROLE_CHOICES = [('client', 'Client'), ('admin', 'Administrateur')]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profil')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    telephone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    icone = models.CharField(max_length=10, default='')

    def __str__(self):
        return self.nom

class Plat(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField()
    prix = models.DecimalField(max_digits=8, decimal_places=2)
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True)
    disponible = models.BooleanField(default=True)
    temps_preparation = models.IntegerField(default=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom

class Commande(models.Model):
    STATUS_CHOICES = [
        ('en_attente', 'En attente'),
        ('en_preparation', 'En preparation'),
        ('pret', 'Pret'),
        ('livre', 'Livre'),
        ('annule', 'Annule'),
    ]
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commandes')
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='en_attente')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Commande #{self.id} - {self.client.username}"

    def calculer_total(self):
        self.total = sum(item.sous_total() for item in self.items.all())
        self.save()

class CommandeItem(models.Model):
    commande = models.ForeignKey(Commande, related_name='items', on_delete=models.CASCADE)
    plat = models.ForeignKey(Plat, on_delete=models.CASCADE)
    quantite = models.IntegerField(default=1)
    prix_unitaire = models.DecimalField(max_digits=8, decimal_places=2)

    def sous_total(self):
        return self.quantite * self.prix_unitaire

    def __str__(self):
        return f"{self.quantite}x {self.plat.nom}"
        