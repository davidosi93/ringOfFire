import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Game } from 'src/models/game';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string | undefined = '';
  game$!: Observable<any>;
  game!: Game;
  private firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog) { }


  ngOnInit(): void {
    this.newGame();
    const aCollection = collection(this.firestore, 'games');
    this.game$ = collectionData(aCollection);
    this.game$.subscribe((game) => {
      console.log('Game update', game);
    });
  }

  newGame() {
    this.game = new Game();
    this.firestore.collection('games').addDoc();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      console.log('Game is', this.game);
      console.log('New Card', this.currentCard);

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        if (this.currentCard !== undefined && typeof this.currentCard === "string") {
          this.game.playedCards.push(this.currentCard);
        }
        this.pickCardAnimation = false;
      }, 1000)
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }

}
