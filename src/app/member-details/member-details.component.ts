import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppService } from '../app.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

// This interface may be useful in the times ahead...
interface Member {
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent
  implements OnInit {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  mode = 'create';
  memberId = null;

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {

    this.memberForm = new FormGroup({
      firstName: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      lastName: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
      jobTitle: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(5)
        ]
      }),
      team: new FormControl(null, Validators.required),
      status: new FormControl('Inactive')
    });

    this.activeRoute.paramMap.subscribe((param: ParamMap) => {
      if (param.has('id')) {
        this.mode = 'edit';
        this.memberId = param.get('id');
        this.appService.getMember(this.memberId).subscribe((member) => {
          this.memberForm.setValue({
            firstName: member.firstName,
            lastName: member.lastName,
            jobTitle: member.jobTitle,
            team: member.team,
            status: member.status
          });
        });
      } else {
        this.mode = 'create';
        this.memberId = null;
      }
    });

    this.appService.getTeams().subscribe(teams => (this.teams = teams));
  }

  // ngOnChanges() { }

  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    this.memberModel = form.value;
    if (this.mode === 'create') {
      this.appService.addMember(this.memberModel).subscribe((result) => {
        this.router.navigate(['members']);
      });
    } else {
      this.appService.updateMember(this.memberId, this.memberModel).subscribe((result) => {
        this.router.navigate(['members']);
      });
    }

  }
}
