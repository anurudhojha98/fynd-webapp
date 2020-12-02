import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MoviesComponent } from '../movies/movies.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit,AfterViewInit {
  title = 'frontend';
  total:number=0;
  page:number=0;
  pageSize:number=10;
  pageSizeOptions:any=[10,20,50,100];
  genres = new FormControl();
  searchText:any;
  genreList:string[]  = ["Action", "Adventure", "Classic", "Comedy", "Romance", "Horror", "Thriller",
  "Drama", "Biopic", "Documentry", "Animation", "Fantasy"];
  displayedColumns: string[] = ['name', 'popularity', 'director','genre','imdb_score','action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filter: string[]=[];
  params:any={};
  isAdmin:boolean=false;
  constructor(
    private dialog:MatDialog,
    private reqService:RequestService
  ){

  }
   ngOnInit(){
     let data=localStorage.getItem('user');
     let user;
     if(data){
       user=JSON.parse(data);
      this.isAdmin= user.isAuthenticated?true:false;
     }
     this.reqService.logoutObservable.subscribe((logoutObj:any)=>{
       console.log(logoutObj);
        if(logoutObj.isLogout){
           this.isAdmin=false;
        }
     },(err)=>{
       console.log(err);
     })
     console.log(user);
     this.getMoviesList();
   }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
  }
  sortData(event){
    this.params['sortKey']=event.active;
    this.params['sortOrder']=event.direction;
    this.getMoviesList();
  }
  loadPage(event){
    this.page=event.pageIndex;
    this.pageSize=event.pageSize;
    this.getMoviesList();
  }
  addMovie(data){
    const dialogConsentRef = this.dialog.open(MoviesComponent, {
      width: '500px',
      data: {data}
    });
    dialogConsentRef.afterClosed().subscribe(result => {
      this.getMoviesList();
    
    });
  }
  getMoviesList(){
    this.params['page']=this.page;
    this.params['pageSize']=this.pageSize;
    this.reqService.getMovieList(this.filter,this.params).subscribe((res:any)=>{
      console.log(res);
      this.total=res.total;
      res.data.map((data)=>data['popularity']=data['99popularity']);
      this.dataSource=res.data;
    },
      (err)=>{
      console.error(err);
    });
  }
  change(event):void{
    console.log(event);
    this.filter=event;
  }
  genreFilter():void{
    this.getMoviesList();
  }
  onInputChange(char):void{
       this.params['searchText']=char;
       this.getMoviesList();
  }
  editData(data){
    const dialogConsentRef = this.dialog.open(MoviesComponent, {
      width: '500px',
      data: {data,isUpdate:true}
    });
    dialogConsentRef.afterClosed().subscribe(result => {
      this.getMoviesList();
    
    });
  }
  deleteData(element){
    let id=element._id;
    let payload={isAuthenticated:true};
    this.reqService.deleteMovie(id,payload).subscribe((res)=>{
      console.log(res);
      this.getMoviesList();
    },(err)=>{
      console.error(err);
    })

  }
  onGenreRemoved(gen: string) {
    const genre = this.genres?.value;
    this.removeFirst(genre, gen);
    this.genres.setValue(genre); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
  
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
