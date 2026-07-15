from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import SignupSerializer

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class SignupView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = SignupSerializer

class SearchMe(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'email': request.user.email})