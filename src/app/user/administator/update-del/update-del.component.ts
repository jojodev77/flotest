/* import natif angular */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Data } from '@angular/router';

/* Services */
import { ServicesService } from '../../administrator/update-del-service/services.service';
import { UserService } from '../../service/user.service';
import { MessageService } from 'src/app/ines/services/message.service';

/* Model */
import { Bijoux } from 'src/app/achat/models/bijoux.models';

/* RXJS */
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-update-del',
  templateUrl: './update-del.component.html',
  styleUrls: ['./update-del.component.scss']
})
export class UpdateDelComponent implements OnInit {
  updateDelForm: FormGroup;
  selectIdForm: FormGroup;
  Type = [
    { value: 1, viewValue: 'bagues' },
    { value: 2, viewValue: 'pendentifs' },
    { value: 3, viewValue: 'bracelets' },
    { value: 4, viewValue: 'boucles' },
    { value: 5, viewValue: 'colliers' },
    { value: 6, viewValue: 'broches' },
    { value: 7, viewValue: 'parures' },
    { value: 8, viewValue: 'bien-être' },
    { value: 9, viewValue: 'Tour de cou' },
  ];
  getBijoux: Bijoux[];
  bijoux = new Array<Bijoux[]>();
  bijouxSubcription: Subscription;
  bijouxId: Bijoux;
  chargeToPayedSubcription: Subscription;
  success: string;
  error: string;
  selectId: any;
  constructor(
    private updateService: ServicesService,
    private userService: UserService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.updateDelForm = this.updateService.buildForm(this.getBijoux);
    this.userService.getBijouxOfSql().subscribe(
      (data: Data) => { this.getBijoux = data as Bijoux[]; }
    );
    this.initModifForm();
    this.initSelectForm();
  }

  initModifForm() {
    this.updateDelForm = this.fb.group({
      id: null,
      type: '',
      forme: '',
      couleur: '',
      couleurdeux: '',
      couleurtrois: '',
      materiaux: '',
      materiauxdeux: '',
      materiauxtrois: '',
      prix: null,
      image: '',
      information: '',
      stock: null,
    });
  }

  initSelectForm() {
    this.selectIdForm = this.fb.group({
      selectId: ['']
    });
  }


  selectIdOfBijoux() {
    console.log(this.selectIdForm.value.selectId);
    this.updateDelForm = this.updateService.buildForm(this.getBijoux);
    this.userService.getBijouxOfSql().pipe(
      map(
        (data: Bijoux[]) => data.filter(
          (article: Bijoux) => article.id === this.selectIdForm.value.selectId
        )
      )
    ).subscribe(
      (data: any[]) => { this.getBijoux = data; }
    );
  }
  listReset() {
    location.reload();
  }

  updateBijoux(
    type, forme, couleur, couleurdeux, couleurtrois, materiaux,
    materiauxdeux, materiauxtrois, prix, image, information, stock, id) {
    this.success = 'oui';
    this.error = 'non';

    this.userService.update({
      type: type.value, forme: forme.value, couleur: couleur.value,
      couleurdeux: couleurdeux.value,
      couleurtrois: couleurtrois.value,
      materiaux: materiaux.value, materiauxdeux: materiauxdeux.value,
      materiauxtrois: materiauxtrois.value,
      prix: prix.value, image: image.value,
      information: information.value, stock: stock.value, id: +id
    })
      .subscribe(
        (res) => {
          this.getBijoux = res;
          this.success = 'Updated successfully';
          this.messageService.openModalSuccesUpdateBijoux();
        },
        (err) => this.error = err
      );
  }

  deleteBijoux(id) {
    this.success = '';
    this.error = '';

    this.userService.deleteBijoux(+ id)
      .subscribe(
        (res: Bijoux[]) => {
          this.getBijoux = res;
          this.messageService.openModalSuccesDelBijoux();
        },
        (err) => this.error = err
      );
  }
}


