import {
  Component,
  AfterViewInit,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Dichiariamo Swiper a livello globale per evitare errori TypeScript,
// visto che viene caricato dinamicamente.
declare var Swiper: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home implements AfterViewInit {

  // Proprietà per gli Swiper
  private swiperProps: any = {
    i7cfci: {
      cdnScript: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
      cdnStyle: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
      actions: "", vertical: false, loop: false, freeMode: false, autoHeight: false, navigation: "",
      initialSlide: "0", speed: 300, effect: "coverflow", slidesPerView: 1, slidesPerGroup: 1,
      spaceBetween: 0, slidesOffsetBefore: 0, slidesOffsetAfter: 0, centeredSlides: false,
      crossFade: false, cubeEffectShadow: true, cubeEffectSlideShadows: true, cubeEffectShadowOffset: 20,
      cubeEffectShadowScale: 0.94, coverflowEffectDepth: 100, coverflowEffectModifier: 1,
      coverflowEffectRotate: 50, coverflowEffectScale: 1, coverflowEffectStretch: 0,
      coverflowEffectSlideShadows: false, flipEffectLimitRotation: true, flipEffectSlideShadows: true,
      cardsEffectPerSlideOffset: 8, cardsEffectPerSlideRotate: 2, cardsEffectRotate: true,
      cardsEffectSlideShadows: true, autoplay: true, autoplayDelay: 2000,
      autoplayDisableOnInteraction: true, autoplayWaitForTransition: true,
      autoplayPauseOnMouseEnter: false, autoplayReverseDirection: false, autoplayStopOnLastSlide: false,
      pagination: "", dynamicBullets: false, clickableBullets: true, progressbarOpposite: false,
      scrollbar: "", scrollbarDraggable: false, scrollbarHide: true, parallax: true,
      mobile: false, mobileBreakpoint: 460, mobileSlidesPerView: 1, mobileSlidesPerGroup: 1,
      mobileSpaceBetween: 0, tablet: false, tabletBreakpoint: 991, tabletSlidesPerView: 1,
      tabletSlidesPerGroup: 1, tabletSpaceBetween: 0, allowTouchMove: true, grabCursor: false,
    },
    ijnl8k: {
      cdnScript: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
      cdnStyle: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
      actions: "", vertical: false, loop: false, freeMode: false, autoHeight: false, navigation: "",
      initialSlide: "0", speed: 300, effect: "slide", slidesPerView: 1, slidesPerGroup: 1,
      spaceBetween: 0, slidesOffsetBefore: 0, slidesOffsetAfter: 0, centeredSlides: false,
      crossFade: false, cubeEffectShadow: true, cubeEffectSlideShadows: true, cubeEffectShadowOffset: 20,
      cubeEffectShadowScale: 0.94, coverflowEffectDepth: 100, coverflowEffectModifier: 1,
      coverflowEffectRotate: 50, coverflowEffectScale: 1, coverflowEffectStretch: 0,
      coverflowEffectSlideShadows: true, flipEffectLimitRotation: true, flipEffectSlideShadows: true,
      cardsEffectPerSlideOffset: 8, cardsEffectPerSlideRotate: 2, cardsEffectRotate: true,
      cardsEffectSlideShadows: true, autoplay: false, autoplayDelay: 3000,
      autoplayDisableOnInteraction: true, autoplayWaitForTransition: true,
      autoplayPauseOnMouseEnter: false, autoplayReverseDirection: false, autoplayStopOnLastSlide: false,
      pagination: "", dynamicBullets: false, clickableBullets: true, progressbarOpposite: false,
      scrollbar: "", scrollbarDraggable: false, scrollbarHide: true, parallax: false,
      mobile: false, mobileBreakpoint: 460, mobileSlidesPerView: 1, mobileSlidesPerGroup: 1,
      mobileSpaceBetween: 0, tablet: false, tabletBreakpoint: 991, tabletSlidesPerView: 1,
      tabletSlidesPerGroup: 1, tabletSpaceBetween: 0, allowTouchMove: true, grabCursor: false,
    },
    ilu258: {
      cdnScript: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
      cdnStyle: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css",
      actions: "", vertical: false, loop: true, freeMode: false, autoHeight: false, navigation: "",
      initialSlide: "0", speed: 300, effect: "slide", slidesPerView: 1, slidesPerGroup: 1,
      spaceBetween: 0, slidesOffsetBefore: 0, slidesOffsetAfter: 0, centeredSlides: false,
      crossFade: false, cubeEffectShadow: true, cubeEffectSlideShadows: true, cubeEffectShadowOffset: 20,
      cubeEffectShadowScale: 0.94, coverflowEffectDepth: 100, coverflowEffectModifier: 1,
      coverflowEffectRotate: 50, coverflowEffectScale: 1, coverflowEffectStretch: 0,
      coverflowEffectSlideShadows: true, flipEffectLimitRotation: true, flipEffectSlideShadows: true,
      cardsEffectPerSlideOffset: 8, cardsEffectPerSlideRotate: 2, cardsEffectRotate: true,
      cardsEffectSlideShadows: true, autoplay: false, autoplayDelay: 3000,
      autoplayDisableOnInteraction: true, autoplayWaitForTransition: true,
      autoplayPauseOnMouseEnter: false, autoplayReverseDirection: false, autoplayStopOnLastSlide: false,
      pagination: "", dynamicBullets: false, clickableBullets: true, progressbarOpposite: false,
      scrollbar: "", scrollbarDraggable: false, scrollbarHide: true, parallax: false,
      mobile: false, mobileBreakpoint: 460, mobileSlidesPerView: 1, mobileSlidesPerGroup: 1,
      mobileSpaceBetween: 0, tablet: false, tabletBreakpoint: 991, tabletSlidesPerView: 1,
      tabletSlidesPerGroup: 1, tabletSpaceBetween: 0, allowTouchMove: true, grabCursor: false,
    },
  };

  // Proprietà per le animazioni
  private animationProps: any = {
    i77gkk: { animationUpdateEvent: "animation:update" },
    itbm1r: { animationUpdateEvent: "animation:update" },
  };

  constructor(
    private elRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    // Eseguiamo questo codice solo nel browser
    if (isPlatformBrowser(this.platformId)) {
      this.initSwipers();
      this.initAnimations();
    }
  }

  // --- Logica di Inizializzazione Swiper ---

  private initSwipers(): void {
    const nativeElement = this.elRef.nativeElement.parentElement || document;
    const swiperIds = Object.keys(this.swiperProps);

    if (swiperIds.length === 0) return;

    // Controlla se Swiper è già caricato
    if ((window as any).Swiper) {
      this.runSwiperInitializers(nativeElement);
    } else {
      // Carica Swiper se non presente (usa il primo ID per trovare i link CDN)
      const firstProps = this.swiperProps[swiperIds[0]];
      const { cdnScript, cdnStyle } = firstProps || {};

      const styles = Array.isArray(cdnStyle) ? [...cdnStyle] : [cdnStyle];
      const scripts = Array.isArray(cdnScript) ? [...cdnScript] : [cdnScript];

      // Carica stili
      styles.forEach(href => this.loadStyle(href));

      // Carica script in sequenza e poi inizializza
      this.loadScriptsSequentially(scripts).then(() => {
        this.runSwiperInitializers(nativeElement);
      }).catch(err => console.error("Errore caricamento script Swiper:", err));
    }
  }

  private runSwiperInitializers(container: HTMLElement | Document): void {
    if (!(window as any).Swiper) {
      console.error("Swiper non è definito anche dopo il caricamento.");
      return;
    }

    Object.keys(this.swiperProps).forEach(id => {
      const el = container.querySelector(`#${id}`);
      const props = this.swiperProps[id];
      if (el && props) {
        // Questa è la logica IIFE originale, ora in un metodo
        this.initializeSwiperInstance(el, props, window);
      }
    });
  }

  /**
   * Questo metodo è una traduzione 1:1 della tua funzione IIFE
   * per un'istanza Swiper.
   */
  private initializeSwiperInstance(s: Element, t: any, R: Window): void {
    const w = (s as any).__onLoad,
      D = (s as any).__activeSlide,
      F = (s as any).__inPreview,
      { cdnScript: W, cdnStyle: q, slidesPerView: z } = t || {},
      r = (m: any) => (isNaN(m) ? void 0 : parseFloat(m));

    const m: any = {
      loop: t.loop,
      speed: t.speed,
      initialSlide: t.initialSlide,
      direction: t.vertical ? "vertical" : "horizontal",
      effect: t.effect,
      freeMode: t.freeMode,
      parallax: t.parallax,
      autoHeight: t.autoHeight,
      allowTouchMove: t.allowTouchMove,
      grabCursor: t.grabCursor,
      simulateTouch: !0,
      breakpoints: {},
      slidesPerView: isNaN(z) ? z : r(z),
      slidesPerGroup: r(t.slidesPerGroup),
      spaceBetween: r(t.spaceBetween),
      slidesOffsetBefore: r(t.slidesOffsetBefore),
      slidesOffsetAfter: r(t.slidesOffsetAfter),
      centeredSlides: t.centeredSlides,
      fadeEffect: { crossFade: t.crossFade },
      cubeEffect: {
        shadow: t.cubeEffectShadow,
        slideShadows: t.cubeEffectSlideShadows,
        shadowOffset: r(t.cubeEffectShadowOffset),
        shadowScale: r(t.cubeEffectShadowScale),
      },
      coverflowEffect: {
        depth: r(t.coverflowEffectDepth),
        modifier: r(t.coverflowEffectModifier),
        rotate: r(t.coverflowEffectRotate),
        scale: r(t.coverflowEffectScale),
        stretch: r(t.coverflowEffectStretch),
        slideShadows: t.coverflowEffectSlideShadows,
      },
      flipEffect: {
        limitRotation: t.flipEffectLimitRotation,
        slideShadows: t.flipEffectSlideShadows,
      },
      cardsEffect: {
        perSlideOffset: r(t.cardsEffectPerSlideOffset),
        perSlideRotate: r(t.cardsEffectPerSlideRotate),
        rotate: t.cardsEffectRotate,
        slideShadows: t.cardsEffectSlideShadows,
      },
      navigation: {
        nextEl: s.querySelector(".swiper-button-next"),
        prevEl: s.querySelector(".swiper-button-prev"),
      },
      pagination: {
        type: t.pagination || "bullets",
        dynamicBullets: t.dynamicBullets,
        clickable: t.clickableBullets,
        progressbarOpposite: t.progressbarOpposite,
        el: s.querySelector(".swiper-pagination"),
      },
      scrollbar: {
        el: s.querySelector(".swiper-scrollbar"),
        draggable: t.scrollbarDraggable,
        hide: t.scrollbarHide,
      },
      autoplay: t.autoplay && {
        delay: t.autoplayDelay,
        disableOnInteraction: t.autoplayDisableOnInteraction,
        pauseOnMouseEnter: t.autoplayPauseOnMouseEnter,
        reverseDirection: t.autoplayReverseDirection,
        stopOnLastSlide: t.autoplayStopOnLastSlide,
        waitForTransition: t.autoplayWaitForTransition,
      },
    };
    if (t.tablet) {
      const { tabletBreakpoint: O, tabletSlidesPerView: g } = t, _ = r(O);
      m.breakpoints[_!] = {
        slidesPerView: isNaN(g) ? g : r(g),
        slidesPerGroup: r(t.tabletSlidesPerGroup),
        spaceBetween: r(t.tabletSpaceBetween),
      };
    }
    if (t.mobile) {
      const { mobileBreakpoint: O, mobileSlidesPerView: g } = t, _ = r(O);
      m.breakpoints[_!] = {
        slidesPerView: isNaN(g) ? g : r(g),
        slidesPerGroup: r(t.mobileSlidesPerGroup),
        spaceBetween: r(t.mobileSpaceBetween),
      };
    }
    w && !F && (m.simulateTouch = !1), D && (m.initialSlide = D);
    const H = new (R as any).Swiper(s, m);
    w == null || w(H);
  }

  // --- Logica di Inizializzazione Animazioni ---

  private initAnimations(): void {
    const nativeElement = this.elRef.nativeElement.parentElement || document;
    const animationIds = Object.keys(this.animationProps);

    animationIds.forEach(id => {
      const el = nativeElement.querySelector(`#${id}`);
      const props = this.animationProps[id];
      if (el && props) {
        // Questa è la logica IIFE originale, ora in un metodo
        this.initializeAnimationInstance(el as HTMLElement, props);
      }
    });
  }

  /**
   * Questo metodo è una traduzione 1:1 della tua funzione IIFE
   * per l'IntersectionObserver delle animazioni.
   */
  private initializeAnimationInstance(n: HTMLElement, t: any): void {
    let e: IntersectionObserver | null = null;
    const r = () => {
        e == null || e.disconnect(), (e = null);
      },
      i = () => {
        r();
        const a = n.style;
        (a.animationName = ""),
          requestAnimationFrame(() => {
            const m = getComputedStyle(n),
              c = m.getPropertyValue("animation-name").trim(),
              l = m.getPropertyValue("--animation-on-scroll").trim() !== "false",
              f = parseFloat(m.getPropertyValue("--animation-threshold").trim()) || 0.2,
              s = m.getPropertyValue("--animation-repeat").trim() === "true",
              o = () => {
                (a.animationName = "none"),
                  n.offsetWidth, // force reflow
                  (a.animationName = c),
                  (a.animationPlayState = "running");
              };
            if (!c || c === "none") {
              (a.animationName = "none"), (a.animationPlayState = "paused");
              return;
            }
            if (!l) {
              o();
              return;
            }
            (a.animationPlayState = "paused"),
              (e = new IntersectionObserver(
                (p) => {
                  p.forEach((d) => {
                    d.isIntersecting && (o(), !s && r());
                  });
                },
                { threshold: f }
              )),
              e.observe(n);
          });
      };
    n.addEventListener(t.animationUpdateEvent, i), i();
  }

  // --- Utility per il caricamento ---

  private loadStyle(href: string): void {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.href = href;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }

  private loadScriptsSequentially(scripts: string[]): Promise<void> {
    return scripts.reduce((promise, script) => {
      return promise.then(() => this.loadScript(script));
    }, Promise.resolve());
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(); // Già caricato
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Errore nel caricare ${src}`));
      document.head.appendChild(script);
    });
  }
}
