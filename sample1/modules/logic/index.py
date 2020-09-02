from django.http import HttpResponse, JsonResponse
from django.template import loader
from ..validation.inputvalidation import InputValidation
from sample1.models import Moves
from sample1.models import Winner
import json
from django.shortcuts import render
import random

class Logic:
    
    def index(self, request):
        try:
            input_validation = InputValidation()
            value = self.process_previous_wins(input_validation.getParams(request))
            
            return JsonResponse({"value": value}, safe=False)
        except:
            raise
        
    def win(self, request):
        try:
            input_validation = InputValidation()
            ordered_choices = input_validation.valid_list_format3(request.GET.getlist('orderedChoices[]'))
            ordered_choices.sort()
            winner = input_validation.valid_winner(request.GET['winner'])
            self.logWin(winner)
            ret_val = self.iterate_winner_data(ordered_choices, winner)
            
            return JsonResponse({"saved": ret_val}, safe=False)
        except:
            raise
        
    def logWin(self, winner):
        player = "opp" 
        if 2 == int(winner):
            player = "comp"
        elif 3 == int(winner):
            player = "draw"
            
        win = Winner()
        win.winner = player
        win.save()
    
    def save_winner(self, cell, order, chosenBy, winner):
        moves = Moves()
        moves.cell = cell
        moves.moveCount = order
        moves.player = chosenBy
        moves.winner = winner
        moves.save()
        
    def iterate_winner_data(self, ordered_choices, winner):
        try:
            input_validation = InputValidation()
            for value in ordered_choices:
                sub_list = value.split('_')
                order = input_validation.valid_int(sub_list[0])
                chosen_by = input_validation.valid_int(sub_list[1])
                cell = input_validation.valid_cell_format(sub_list[2])
                
                self.save_winner(cell, order, chosen_by, winner)
            
            return 1    
        except:
            return 0
            
        
    def process_previous_wins(self, obj):
        return self.select_next_move_records(obj)
    
    def select_next_move_records(self, obj):
        move_count = obj["moveCount"]
        potential_choices = obj["potentialChoices"]
        open_cells = obj["openCells"]
        moves = Moves.objects.filter(**{'moveCount': move_count})
        weights = {}
        weights_opp = {}
        ret_cell = ""
        highest_weight_comp = 1
        highest_weight_opp = 1
        options = []

        weights, weights_opp, highest_weight_comp = self.populate_objects(
            moves, 
            open_cells, 
            weights, 
            highest_weight_comp, 
            weights_opp, 
            highest_weight_opp)
                    
        retCell = self.use_js_cell(obj, weights, ret_cell)
    
        return self.weigh_options(
            ret_cell, 
            weights,
            potential_choices,
            highest_weight_comp, 
            weights_opp)
        
    def weigh_options(
            self, 
            ret_cell, 
            weights,
            potential_choices,
            highest_weight_comp, 
            weights_opp):
        if len(weights) > 1:
            potentialsList = [x for x in potential_choices 
                 if potential_choices.count(x) > 1]
            
            ###if not potentialsList:
            for cell, heaviest in weights.items():
                if heaviest == highest_weight_comp:
                    if cell in potential_choices and cell not in weights_opp:
                        ret_cell = cell
            ###else:
                ###ret_cell = potentialsList[0]
                
        return ret_cell
        
    
    def use_js_cell(self, obj, weights, ret_cell):
        if (0 == len(weights) or (1 == len(weights) 
            and obj["jsOptionId"] in weights)):
            ret_cell = obj["jsOptionId"]
            
            return ret_cell
    
    def populate_objects(self, moves, open_cells, weights, highest_weight_comp, weights_opp, highest_weight_opp):
        for move in moves:
            if move.cell in open_cells and 2 == move.player:
                if weights.get(move) is None:
                    weights[move.cell] = 1
                else:
                    weights[move.cell] = weights[move.cell] + 1
                    if weights[move.cell] > highest_weight_comp:
                        highest_weight_comp = weights[move.cell]
            elif move.cell in open_cells and 1 == move.player:
                if weights_opp.get(move) is None:
                    weights_opp[move.cell] = 1
                else:
                    weights_opp[move.cell] = weights_opp[move.cell] + 1
                    if weights_opp[move.cell] > highest_weight_opp:
                        highest_weight_opp = weights_opp[move.cell]
                        
        return weights, weights_opp, highest_weight_comp
    
    
    
    
    
    