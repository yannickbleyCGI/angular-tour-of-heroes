import { Injectable } from '@angular/core';
import { Hero } from './hero'; // Le modèle pour les données
import { HEROES } from './mock-heroes';
import { Observable, of} from 'rxjs'; // Observable rend asynchrone l'échange de données avec les serveurs distants
import { MessagesService } from './messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private log(message: string){
    this.messagesService.add(`HeroService: ${message}`);
  }

  private heroesUrl = 'api/heroes'; //
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }) // servent à dire quel format les données doivent prendre
  };

  constructor( private messagesService: MessagesService, 
               private http: HttpClient ) { }

  getHeroes(): Observable<Hero[]> { // Observable doit retourner un tableau de type Hero
    //this.messagesService.add('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)// Requête GET qui demande au serveur tous les heroes en base
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }


  getHero(id: number): Observable<Hero> { // requête GET by id qui demande au serveur un hero par son id, doit retourner un Observable de type de Hero
    const url = `${this.heroesUrl}/${id}`  
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
   
  }

  updateHero(hero : Hero): Observable<any>{ // requête PUT pour mettre à jour un hero, prend en paramètre le hero qui va updater l'ancien, 
                                            // this.httpOptions pour formater les données en Json 
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero :Hero): Observable<Hero> { // Requête POST d'ajout d'un hero, retourne un Observable de type Hero
                                          // Prend en paramètre le hero qu'il va ajouter en base
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe( 
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number ): Observable<Hero> { // Requête DELETE de suppression d'un hero, retourne un Observable de type Hero 
                                                       //
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe( 
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }


  /* récuperer les heros avec une recherche */

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()){
      // s'il y a rien dans la barre de recherche
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  
}
