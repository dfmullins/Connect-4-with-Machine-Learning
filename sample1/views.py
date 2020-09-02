from django.http import HttpResponse
from django.http import HttpResponse, Http404
from django.template import loader
import importlib

def index(request, module = "home", action = "index", params = ""):
    try:
        mod = importlib.import_module(".modules." + str(module) + ".index", package="sample1")
        class_ = getattr(mod, str(module).capitalize())
        method = getattr(class_(), action)
        
        return method(request)
    except:
        raise Http404("Page does not exist")
