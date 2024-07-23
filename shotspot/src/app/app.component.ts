import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from'@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shotspot';
  activeTab = 0;

  result = {
    id:'',
    src:'',
    episode:'',
    duration:'',
    score:''
  }

  isPlay: boolean = false;
  @ViewChild("videoPlayer", { static: false }) videoplayer!: ElementRef;

  urlDetails = {
    url: '',
    img:''
  }
  constructor(private http: HttpClient){}

  toggleVideo(event: any) {
    console.log("play clicked");
    
    this.videoplayer.nativeElement.play();
  }
  
  submitForm(form: any){
    console.log("Submitted this",form,form.valid,this.urlDetails);

    if(form.valid){
      const url = this.urlDetails.url ? encodeURIComponent(this.urlDetails.url) : ''
      const params = new HttpParams().set('url',url)
      this.http.get("https://api.trace.moe/search?url=" + url).pipe(
        catchError((error) => {  
          console.error('Error occurred:', error);  
          return throwError(error);  
        })  
      ).subscribe((data:any) => {
        
        const first = data.result[0]

        this.result.id = first.filename;
        this.result.episode = first.episode;
        this.result.src = first.video;
        this.result.duration = first.from;
        this.result.score = (parseInt(first.similarity) * 100).toString();

        var video:any = document.getElementById('video');
        video.src = first.video;
        video.play();
        console.log(data);  
      });
    }
  }

  submitFormPOST(form: any){
    console.log("Submitted this",form,form.valid,this.urlDetails);

    if(form.valid){
      

      this.http.post("https://api.trace.moe/search", this.urlDetails.img).pipe(
        catchError((error) => {  
          console.error('Error occurred:', error);  
          return throwError(error);  
        })  
      ).subscribe((data:any) => {
        
        const first = data.result[0]

        this.result.id = first.filename;
        this.result.episode = first.episode;
        this.result.src = first.video;
        this.result.duration = first.from;
        this.result.score = (parseInt(first.similarity) * 100).toString();

        var video:any = document.getElementById('video');
        video.src = first.video;
        video.play();
        console.log(data);  
      });
    }
  }

  openURL(){
    const urlDiv = document.getElementById("urlDiv")
    const uploadDiv = document.getElementById("uploadDiv")

    if(urlDiv){
      urlDiv.style.display = 'block';
      this.activeTab = 0
    }

    if(uploadDiv){
      uploadDiv.style.display = 'none';
    }

  }

  openUpload(){
    const urlDiv = document.getElementById("urlDiv")
    const uploadDiv = document.getElementById("uploadDiv")

    if(urlDiv){
      urlDiv.style.display = 'none';
    }

    if(uploadDiv){
      uploadDiv.style.display = 'block';
      this.activeTab = 1
    }
  }
}
