import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'app';
  // d = new Date();
  daysOfWeek = ['S','M', 'T', 'W', 'T', 'F', 'S'];
  // monthArray = ['January', 'February', 'March', 'April','May','June','July','August', 'September', 'October','November','December'];
   month = moment().format('MMMM');
   year = moment().format('YYYY');
  // dayStarted = moment().startOf('month').fromNow().slice(0,1);
  // currentDate = this.d.getDate();
  // var difference = (this.currentDate+1) - this.dayStarted;
  //

  public date = moment();

  public dateForm: FormGroup;

  public daysArray;

  public store = [];

  public submitted = false;

  public isReserved = null;

  public i = 0;

  public DF;

constructor(private fb: FormBuilder) {
  this.initDateRange();
}

public initDateRange() {
  return (this.dateForm = this.fb.group({
    dateFrom : [null, Validators.required],
    dateTo : [null, Validators.required]
  }));
}

public ngOnInit() {
  this.daysArray = this.createCalendar(this.date);
  if(this.store) {
  this.store = JSON.parse(localStorage.getItem('Dates'));
  }
  else {
    return;
  }
  console.log(this.store);
}

  public createCalendar(month) {
    let firstDay = moment(month).startOf('M');
    let days = Array.apply(null, {length: month.daysInMonth() })
    .map(Number.call, Number)
    .map(n => {
      return moment(firstDay).add(n, 'd');
    });
    for(let i = 0; i < firstDay.weekday(); i++) {
      days.unshift(null);
    }
    return days;
  }

  public todayCheck(day) {
    if(!day)
    return false;

    return moment().format('L') === day.format('L');
  }


  public nextMonth() {
    this.date.add(1, 'M');
    this.daysArray = this.createCalendar(this.date);
  }

  public previousMonth() {
    this.date.subtract(1, 'M');
    this.daysArray = this.createCalendar(this.date);
  }

  // public checkEntry(idx) {
  //   if((this.dateArray.indexOf(idx)) > -1) {
  //     this.dateArray.splice(idx,1);
  //     return;
  //   }
  //   this.dateArray.push(idx);
  // }

  // public createEvent(idx) {
  //   if(idx < moment().format('D')) {
  //     alert('Cannot create event on this date');
  //     return false;
  //   }
  //   this.checkEntry(idx);
  //   this.submitted = true;
  // }

  public isSelected(day) {
    if(!day) {
      return false;
    }
    let dateFromMoment = moment(this.dateForm.value.dateFrom, 'YYYY-MM-DD');
    let dateToMoment = moment(this.dateForm.value.dateTo, 'YYYY-MM-DD');
    if(this.dateForm.valid) {
      return (
        dateFromMoment.isSameOrBefore(day) && dateToMoment.isSameOrAfter(day)
      )
    }
    if (this.dateForm.get('dateFrom').valid) {
      return dateFromMoment.isSame(day);
    }
  }

  public reserve() {
    if(!this.dateForm.valid) {
      return false;
    }
    let dateFromMoment = this.dateForm.value.dateFrom;
    let dateToMoment = this.dateForm.value.dateTo;
    this.isReserved = `Reserved from ${dateFromMoment} to ${dateToMoment}`;
  }

  public addValue(from, to, title) {
    if(!from || !to || !title) {
      alert('Fill the fields');
      return false;
    }

     let val = {'index' : ++this.i,'From': from, 'To': to, 'Title' : title};
     this.store.push(val);
     localStorage.setItem('Dates', JSON.stringify(this.store));
     console.log(localStorage.getItem('Dates'));
  }

  public edit(date1, date2, title) {
    (<HTMLInputElement>document.getElementById('fromDate')).value = date1;
    (<HTMLInputElement>document.getElementById('toDate')).value = date2;
    (<HTMLInputElement>document.getElementById('title')).value = title;
  }

//METHOD TO DELETE AN ARRAY VALUE FROM JSON
  public delete(data, elements) {
    localStorage.removeItem('Dates');
    this.deleteArray(data, elements);
  }

  public deleteArray(array, elements) {
    const index = array.indexOf(elements);
    array.splice(index,1);
    localStorage.setItem('Dates', JSON.stringify(array));
    console.log(localStorage.getItem('Dates'));
  }

  public selectedDate(day) {

    let dayFormatted = day.format('YYYY-MM-DD');
    if(this.dateForm.valid) {
      this.dateForm.setValue({dateFrom: null, dateTo: null});
      return;
    }
    if(!this.dateForm.get('dateFrom').value) {
      this.dateForm.get('dateFrom').patchValue(dayFormatted);
    }
    else {
      this.dateForm.get('dateTo').patchValue(dayFormatted);
    }
  }
}
