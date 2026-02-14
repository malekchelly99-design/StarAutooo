"""
WSGI config for Star Auto backend project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'starauto.settings')

application = get_wsgi_application()
