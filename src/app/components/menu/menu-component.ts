import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TooltipModule,
    ButtonModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './menu-component.html',
  styleUrls: ['./menu-component.scss']
})

export class MenuComponent implements OnInit {


  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  horarioAtual = '';
  usuarioLogado = '';
  

  ngOnInit(): void {
    this.atualizarHorario();
    this.usuarioLogado = this.authService.getNameFromToken() || '';
    setInterval(() => this.atualizarHorario(), 60000);
    
  }

  acessarSecao(secao: string) {
    this.router.navigate([`/${secao}`]);
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  isActive(secao: string): boolean {
    return this.router.url.includes(secao);
  }

  atualizarHorario() {
    const agora = new Date();

    this.horarioAtual = agora.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
