import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table'
import { UserService } from '../../services/user/user.service';
import { UserDTO } from '../../interfaces/UserDTO';
import { UserRegistrationComponent } from './user-registration/user-registration-component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table'; 

@Component({
    selector: 'app-users',
    templateUrl: './user-component.html',
    imports: [UserRegistrationComponent, TableModule, ToastModule, ConfirmDialogModule, ButtonModule],
    providers: [ConfirmationService, MessageService]
})
export class UsersComponent {
    usuarios: UserDTO[] = [];
    @ViewChild('registerUserModal') registerUserModal: any;
    @ViewChild('ut') table: any;

    loading: boolean = false;
    totalElements = 0;

    constructor(
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        //this.loadUsers();
    }

    loadUsers() {
        this.table.first = 0;
        this.loadUsersLazy({
            first: 0,
            rows: 5,
            sortField: 'name',
            sortOrder: 1
        } as TableLazyLoadEvent);
    }

    loadUsersLazy(event: TableLazyLoadEvent) {
        this.loading = true;

        const first = event.first ?? 0;
        const rows = event.rows ?? 10;

        const page = first / rows;
        const size = rows;

        const sortField = event.sortField ?? 'name';
        const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
        const sort = `${sortField},${sortOrder}`;

        this.userService.findAll(page, size, sort).subscribe({
            next: (result: any) => {
                this.usuarios = result.content ?? [];
                this.totalElements = result.totalElements ?? 0;
                this.cd.detectChanges();
                this.loading = false;
            },
            error: () => {
                this.usuarios = [];
                this.totalElements = 0;
                this.loading = false;
                this.cd.detectChanges();
            }
        });
    }


    openRegisterUser() {
        this.registerUserModal.openModal();
    }

    editUser(usuario: UserDTO) {
        this.registerUserModal.show(usuario);
    }

    confirmDeleteUser(usuario: UserDTO) {
        this.confirmationService.confirm({
            message: `Deseja realmente excluir ${usuario.login}?`,
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.deleteUser(usuario)
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Ação cancelada.' });
            }
        });
    }

    deleteUser(usuario: UserDTO) {
        if (!usuario.id) return;

        this.userService.delete(usuario.id).subscribe({
            next: () => {
                this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Usuário ${usuario.name} excluído` });
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error!', detail: err.error.error || err.error.message });
            }
        });
    }

    onUserSaved() {
        this.loadUsers();
    }
}
