# Generated by Django 2.2.15 on 2020-08-24 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Moves',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cell', models.CharField(max_length=4)),
                ('moveCount', models.IntegerField(default=0)),
                ('player', models.IntegerField(default=0)),
                ('winner', models.IntegerField(default=0)),
            ],
        ),
    ]
