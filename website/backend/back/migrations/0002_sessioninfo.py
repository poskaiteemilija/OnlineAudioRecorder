# Generated by Django 3.2.8 on 2021-10-21 18:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SessionInfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sessionID', models.CharField(max_length=50)),
                ('mediaPaths', models.CharField(max_length=1000)),
            ],
        ),
    ]