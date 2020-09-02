from django.db import models

class Moves(models.Model):
    cell = models.CharField(max_length=4)
    moveCount = models.IntegerField(default=0)
    player = models.IntegerField(default=0)
    winner = models.IntegerField(default=0)
    
class Winner(models.Model):
    winner = models.CharField(max_length=4)