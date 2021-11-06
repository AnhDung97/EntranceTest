import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ScreenService } from '../shared/screen.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
})
export class ScreenComponent implements OnInit, OnDestroy {

  @ViewChild('screen') screen: ElementRef;

  unsubscribe$ = new Subject();
  startedImages: number = 5;
  listData: any;
  urlImages: string = '';
  listWidthOfHitZone: any = [];
  arrowState: boolean[] = [false, false, false];

  constructor(private readonly screenService: ScreenService) { }

  ngOnInit() {
    this.getDataList();
  }

  getDataList() {
    this.screenService.getList().pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
      if (res) {
        this.listData = [...res.data];
        this.urlImages = `url(${this.listData[this.startedImages].backgroundUrl})`;
        this.calculateWidthHitZone(this.listData[this.startedImages]);
      }
    })
  }

  renderArrowDirection(px = 0) {
    const screenWidth = window.innerWidth;
    this.arrowState = this.listWidthOfHitZone.map((ele: any, index: number) => {
      const totalWidth = screenWidth + px;
      return index === 0 ? totalWidth <= ele : (totalWidth <= ele && totalWidth > this.listWidthOfHitZone[index - 1]);
    });
  }

  calculateWidthHitZone({ hitzone }) {
    setTimeout(() => {
      const widthTotal = this.screen.nativeElement.clientWidth;
      let sum = 0;
      this.listWidthOfHitZone = hitzone.map((ele: any) => {
        const answer = ((ele * widthTotal) / 100) + sum;
        sum += answer;
        return answer;
      }, 0)
      this.renderArrowDirection();
    }, 100);
  }

  handleScroll(px) {
    this.renderArrowDirection(px);
  }

  handleClickMovingArrow() {
    const index = this.arrowState.findIndex(ele => ele);
    const nextScreen = this.listData.find((ele: any) => ele.id === this.listData[this.startedImages].addressId[index]);
    this.urlImages = nextScreen.backgroundUrl;
    this.screen.nativeElement.style.backgroundImage = `url(${this.urlImages})`;
    this.calculateWidthHitZone(nextScreen);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

}
