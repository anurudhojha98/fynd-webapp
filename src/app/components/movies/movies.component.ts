import { Component, OnInit, Optional, Inject } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormGroupDirective, NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestService } from 'src/app/services/request.service';
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  matcher:ErrorStateMatcher;
  movieForm:FormGroup;
  isUpdate:boolean=false;
  genreList:any = ["Action", "Adventure", "Classic", "Comedy", "Romance", "Horror", "Thriller",
  "Drama", "Biopic", "Documentry", "Animation", "Fantasy"];
  constructor(
    private reqService:RequestService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit(): void {
    this.movieForm=new FormGroup({
      movieName : new FormControl('', [
        Validators.required
      ]),
      popularity : new FormControl('', [
        Validators.required
      ]),
      director : new FormControl('', [
        Validators.required
      ]),
      imdbScore : new FormControl('', [
        Validators.required
      ]),
      genre : new FormControl('', [
        Validators.required
      ]),
    });
    console.log(this.data);
    if(this.data){
      this.isUpdate=this.data?.isUpdate;
      if(this.isUpdate){
        this.movieForm.get('movieName').patchValue(this.data?.data?.name);
        this.movieForm.get('movieName').disable();
        this.movieForm.get('popularity').patchValue(this.data?.data?.popularity);
        this.movieForm.get('director').patchValue(this.data?.data?.director);
        this.movieForm.get('imdbScore').patchValue(this.data?.data?.imdb_score);
        this.movieForm.get('genre').patchValue(this.data?.data?.genre);
      }
    }
    this.matcher = new MyErrorStateMatcher();
  }
  onGenreRemoved(genre: string) {
    const genres = this.movieForm.get('genre')?.value;
    this.removeFirst(genres, genre);
    this.movieForm.get('genre').setValue(genres); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  onSubmit():void{
    if(this.movieForm.valid){
      this.movieForm.get('movieName').enable();
      console.log(this.movieForm.value)
      let payload={
        name:this.movieForm.value.movieName,
        popularity:this.movieForm.value.popularity,
        director:this.movieForm.value.director,
        imdb_score:this.movieForm.value.imdbScore,
        genre:this.movieForm.value.genre,
        isAuthenticated:true
      }
      if(this.isUpdate){
        let id=this.data?.data?._id;
        console.log(payload)
        this.reqService.updateMovie(id,payload).subscribe((res:any)=>{
          console.log(res)
        },(err)=>{
          console.error(err)
        })
      }else{
        this.reqService.addMovie(payload).subscribe((res:any)=>{
          console.log(res)
        },(err)=>{
          console.error(err)
        })
      }

    }
  }

  change(data){
    console.log(this.movieForm.get('genre')?.value)
     console.log(data);
  }
}
