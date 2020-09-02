from django.http import HttpResponse, JsonResponse
from django.template import loader
from ..shared.sharedresources import SharedResources
from sample1.models import Moves
from sample1.models import Winner
import json
from django.shortcuts import render
import random

class Home:
    
    def index(self, request):
        home = loader.get_template('home/home.html')
        shared_resources = SharedResources()
        header, footer = shared_resources.get_page_resources();
        rand_number = random.randint(0,1000)
        resources = {
            'rand': rand_number, 
            'js': self.js_resources(rand_number), 
            'css': self.css_resources(rand_number)
        }
        combined = (header.render(resources, request) 
                    + home.render({}, request) 
                    + footer.render(resources, request))
        
        return HttpResponse(combined)
    
    def start_game(self, request):
        game_board = loader.get_template('gameBoard/gameBoard.html')
        context = {
            "rows": self.get_rows(),
            "cells": self.get_cells()
        }
        
        return JsonResponse(
            {
                "gameBoard": game_board.render(context, request), 
                "wins": self.get_wins_and_losses()
            }, safe=False)
        
    def reset_database(self, request):
        Moves.objects.all().delete()
        Winner.objects.all().delete()
        
        return JsonResponse({"reset": 1}, safe=False)
    
    def get_wins_and_losses(self):
        opp_win_count = Winner.objects.filter(**{'winner': "opp"}).count()
        comp_win_count = Winner.objects.filter(**{'winner': "comp"}).count()
        draw_count = Winner.objects.filter(**{'winner': "draw"}).count()
        
        return {"opp": opp_win_count, "comp": comp_win_count, "draw": draw_count}
        
    
    def get_rows(self):
        return [1,2,3,4,5,6]
    
    def get_cells(self):
        return [1,2,3,4,5,6,7]
    
    def js_resources(self, rand_number):
        return ('<script type="text/javascript" src="/static/js/game/game.js?id=' + str(rand_number) + '"></script>' +
                '<script type="text/javascript" src="/static/js/home/home.js?id=' + str(rand_number) + '"></script>')
    
    def css_resources(self, rand_number):
        return ('<link rel="stylesheet" type="text/css" href="/static/css/home/home.css?id=' + str(rand_number) + '">' +
                '<link rel="stylesheet" type="text/css" href="/static/css/game/game.css?id=' + str(rand_number) + '">')
