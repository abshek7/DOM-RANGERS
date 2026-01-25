import {ChangeDetectorRef, Component ,OnInit} from '@angular/core';
import { AdminService } from '../../../services/adminservice';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-agentmanagement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agentmanagement.html',
  styleUrl: './agentmanagement.css'
})

export class Agentmanagement implements OnInit {

  agents:any[] = [];

  constructor(private adminService: AdminService, private c:ChangeDetectorRef) {}

  ngOnInit() {
    this.adminService.getAgents().subscribe((r:any[]) => {
      this.agents = r;
      this.c.detectChanges()
    });
  }

}
