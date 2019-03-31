import { Component, OnInit } from '@angular/core';
import {SurveyNG,Model} from 'survey-angular';
import {EVALUATION_FORM} from '../../config/evaluationForm';
@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  survey = new Model(EVALUATION_FORM);
  constructor() { }

  ngOnInit() {
    SurveyNG.render
    SurveyNG.render("surveyElement", {model: this.survey});
    this.survey.onComplete.add(this.saveResult);
  }
  saveResult(result:any){
    console.log(result.data);
  }
}
