# Generated by Django 3.2.8 on 2022-01-24 16:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('back', '0006_alter_audiostorage_audio_file'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SessionInfo',
        ),
        migrations.DeleteModel(
            name='TestClass',
        ),
    ]