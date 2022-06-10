import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavBarState } from 'src/app/models/navBarState';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  navBarState: NavBarState = {showList: true, showCreate: false, showEdit: false, shouldReloadScreen: false};

  @Output() 
  navBarEmitter = new EventEmitter<NavBarState>();

  constructor() { }

  ngOnInit(): void {
  }

  public ShowListComponent_navBar(shouldReloadScreen?: boolean): void 
  {
    this.navBarState.showList = true;
    this.navBarState.showCreate = false;
    this.navBarState.showEdit = false;
    this.navBarState.shouldReloadScreen = shouldReloadScreen ?? false;
    this.broadcastNavBarOnClick();
  }

  public ShowCreateComponent_navBar(): void 
  {
    this.navBarState.showList = false;
    this.navBarState.showCreate = true;
    this.navBarState.showEdit = false;
    this.navBarState.shouldReloadScreen = false;
    this.broadcastNavBarOnClick();
  }

  public ShowEditComponent_navBar(): void 
  {
    this.navBarState.showList = false;
    this.navBarState.showCreate = false;
    this.navBarState.showEdit = true;
    this.navBarState.shouldReloadScreen = false;
    this.broadcastNavBarOnClick();
  }

  public OpenExportedGodot(): void 
  {
    if(confirm("Do you really want to open the side experiment?"))
    {
      window.open('http://localhost:8000/GodotExport.html', '_blank');
    }   
  }

  broadcastNavBarOnClick(): void 
  {
    this.navBarEmitter.emit(this.navBarState);
  }
}
