from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from django.core.exceptions import ValidationError as DjangoValidationError


UserModel = get_user_model()

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = ['email', 'password']

    def validate(self, attrs):
        temp_user = UserModel(email=attrs['email'])
        
        try:
            validate_password(attrs['password'], user=temp_user)
        except DjangoValidationError as e:
            raise serializers.ValidationError({'password': list(e.message)})
        
        return attrs
    
    def create(self, validated_data):
        return UserModel.objects.create_user(**validated_data)