import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ScreenService } from '../shared/screen.service';
import { takeUntil } from 'rxjs/operators';
import { ScreenDetailsInterface, ScreenInterface } from '../shared/app.interface';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
})
export class ScreenComponent implements OnInit, OnDestroy {

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('screenWrapper') screenWrapper: ElementRef;

  unsubscribe$ = new Subject();
  startedImages: number = 5;
  listData: ScreenDetailsInterface[];
  urlImages: string = '';
  listWidthOfHitZone: number[] = [];
  arrowState: boolean[] = [false, false, false];
  stateImg: boolean = true;

  constructor(private readonly screenService: ScreenService) { }

  ngOnInit() {
    this.getDataList();
  }

  getDataList() {
    this.screenService.getList().pipe(takeUntil(this.unsubscribe$)).subscribe((res: ScreenInterface) => {
      if (res) {
        this.listData = [...res.data];
        this.urlImages = `url(${this.listData[this.startedImages].backgroundUrl})`;
        this.calculateWidthHitZone(this.listData[this.startedImages]);
      }
    })
  }


  renderArrowDirection(px: number = 0) {
    const screenWidth: number = window.innerWidth;
    this.arrowState = this.listWidthOfHitZone.map((ele: number, index: number) => {
      const totalWidth = screenWidth + px;
      return index === 0 ? totalWidth <= ele : (totalWidth <= ele && totalWidth > this.listWidthOfHitZone[index - 1]);
    });
    this.checkStateImgArrow();
  }

  calculateWidthHitZone({ hitzone }) {
    setTimeout(() => {
      const widthTotal: number = this.screen.nativeElement.clientWidth;
      let sum = 0;
      this.listWidthOfHitZone = hitzone.map((ele: number) => {
        const answer = ((ele * widthTotal) / 100) + sum;
        sum += answer;
        return answer;
      }, 0);
      const scrollLeft: number = this.screen.nativeElement.parentElement.scrollLeft;
      this.renderArrowDirection(scrollLeft);
    }, 100);
  }

  handleScroll(px: number) {
    this.renderArrowDirection(px);
  }

  handleClickMovingArrow() {
    const index: number = this.checkStateImgArrow();
    if (index !== -1) {
      const nextScreen: ScreenDetailsInterface = this.listData.find((ele: ScreenDetailsInterface) => ele.id === this.listData[this.startedImages].addressId[index]);
      this.urlImages = nextScreen.backgroundUrl;
      this.screen.nativeElement.style.backgroundImage = `url(${this.urlImages})`;
      this.startedImages = this.listData.findIndex(ele => ele.id === nextScreen.id);
      this.calculateWidthHitZone(nextScreen);
    }
  }

  checkStateImgArrow() {
    const index: number = this.arrowState.findIndex(ele => ele);
    this.stateImg = index !== -1;
    return index;
  }

  handleScrollScreen(isLeft: boolean) {
    const { clientWidth, scrollLeft } = this.screenWrapper.nativeElement;
    const scrollPx: number = clientWidth + scrollLeft;
    this.screenWrapper.nativeElement.scrollTo({
      left: isLeft ? (scrollLeft - clientWidth) : scrollPx,
      behavior: 'smooth'
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

}
