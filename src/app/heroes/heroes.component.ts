import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';  // J'importe la classe Hero qui va servir de modèle pour les heros à afficher 
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  constructor( private heroService: HeroService) {

   }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes() // avec l'Observable, attend de recevoir le tableau de type Hero
                     .subscribe(heroes => this.heroes = heroes); // subscribe effectue un traitement une fois que l'Observable renvoie les données
                                                                 // ici il fait un callback en prenant le tableau reçu en argument et initialise la propriété heroes avec. 
     
   }

   add(name: string): void {
     name = name.trim();
     if(!name){
       return;
     }
     this.heroService.addHero({name} as Hero )
                     .subscribe(hero => {
                       this.heroes.push(hero)
                     });
   }

   delete(hero: Hero) : void {
     this.heroes = this.heroes.filter(h => h !== hero);
     this.heroService.deleteHero(hero).subscribe();
   }

}
