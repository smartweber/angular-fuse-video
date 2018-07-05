import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '../../animations';

@Component({
  selector: 'app-add-video-dialog',
  templateUrl: './add-video-dialog.component.html',
  styleUrls: ['./add-video-dialog.component.scss'],
  animations: fuseAnimations
})
export class AddVideoDialogComponent implements OnInit {
  steps = [
    {
      title: 'Introduction',
      complete: false,
      data: {}
    },
    {
      title: 'Get the sample code',
      complete: false,
      data: {}
    },
    {
      title: 'Create a project',
      complete: false,
      data: {}
    }
  ];
  currentStep: number;
  totalSteps: number;
  animationDirection: string;
  currentVideoUrl: string;

  isLoadPage: boolean;
  isEditForm: boolean;
  isNextPage: boolean;

  addForm: FormGroup;
  addFormErrors: any;

  constructor(
    public dialogRef: MatDialogRef<AddVideoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  )
  {
    this.isLoadPage = false;
    this.isEditForm = false;
    this.isNextPage = false;
    this.currentStep = 0;
    this.totalSteps = 3;
    this.steps.push({
      title: 'Complete',
      complete : false,
      data : {}
    });
    console.log(data);

    this.addFormErrors = {
      title       : {},
      abstract    : {},
      description : {}
    };
    this.currentVideoUrl = 'https://new-api.virtualevaluator.net/explainer.mp4';
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.addForm = this.formBuilder.group({
      title      : ['', [Validators.required]],
      abstract   : ['', Validators.required],
      description: ['', Validators.required]
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onAddFormValuesChanged();
    });

    this.isLoadPage = true;
  }

  setForm(isPreview: boolean = false) {
    if(!this.steps[this.currentStep]['complete'] && !isPreview) {
      this.addForm.reset();
    } else {
      this.addForm.controls['title'].setValue(this.steps[this.currentStep]['data']['title']);
      this.addForm.controls['abstract'].setValue(this.steps[this.currentStep]['data']['abstract']);
      this.addForm.controls['description'].setValue(this.steps[this.currentStep]['data']['description']);
    }

    this.isNextPage = this.steps[this.currentStep]['complete'];
    this.isEditForm = false;
  }

  onAddFormValuesChanged()
  {
    if(this.addForm.valid) {
      this.isNextPage = true;
    } else {
      this.isNextPage = false;
    }

    for ( const field in this.addFormErrors )
    {
      if ( !this.addFormErrors.hasOwnProperty(field) )
      {
        continue;
      }

      // Clear previous errors
      this.addFormErrors[field] = {};

      // Get the control
      const control = this.addForm.get(field);

      if ( control && control.dirty && !control.valid )
      {
        this.addFormErrors[field] = control.errors;
      }
    }
  }

  updateStepData() {
    if(this.steps[this.currentStep]) {
      if(this.addForm.valid) {
        this.steps[this.currentStep]['complete'] = true;
      } else {
        this.steps[this.currentStep]['complete'] = false;
      }

      this.steps[this.currentStep]['data'] = {
        title       : this.addForm['value']['title'],
        abstract    : this.addForm['value']['abstract'],
        description : this.addForm['value']['description']
      };
    }
  }

  gotoStep(step: number) {
    let isbroken = false;

    if(step > 0) {
      for(let i = 0; i < step; i ++) {
        if(!this.steps[i]['complete']) {
          isbroken = true;
          break;
        }
      }
    }

    if(!isbroken) {
      this.updateStepData();
      this.currentStep = step;
      this.setForm();
    }
  }

  gotoNextStep()
  {
    if ( this.currentStep === this.totalSteps )
    {
      return;
    }

    this.updateStepData();

    // Set the animation direction
    this.animationDirection = 'left';

    // Run change detection so the change
    // in the animation direction registered
    this.cdRef.detectChanges();

    // Increase the current step
    this.currentStep++;
    this.setForm();
  }

  gotoPreviousStep()
  {
    if ( this.currentStep === 0 )
    {
      return;
    }

    // Set the animation direction
    this.animationDirection = 'right';

    // Run change detection so the change
    // in the animation direction registered
    this.cdRef.detectChanges();

    // Decrease the current step
    this.currentStep--;
    this.setForm();
  }

  hideHelp() {
    this.setForm(true);
    this.isEditForm = true;
  }

  showHelp() {
    this.updateStepData();
    this.isEditForm = false;
  }

  onRestart() {
    this.currentStep = 0;
    this.setForm();
  }

  onCloseDialog(){
    this.dialogRef.close();
  }

}

