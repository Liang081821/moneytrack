import bannerImage from "../../../public/banner.jpg";
import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/card";
import Chart from "../../../public/chart.gif";
import Analysis from "../../../public/analysis.gif";
import Project from "../../../public/project.gif";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function LoginSide() {
  const { ref: firstRef, inView: firstInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const { ref: secondRef, inView: secondInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const horizonRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const windowHeight = window.innerHeight;
  console.log(window.innerHeight);
  console.log(window.scrollY);
  const [fadeIn, setFadeIn] = useState(true); // 控制淡入淡出效果

  useEffect(() => {
    const handleScroll = () => {
      if (horizonRef.current) {
        const scrollY = window.scrollY;

        const contentOffset = window.innerHeight;

        const adjustedScrollY = scrollY - contentOffset;

        const newPage = Math.floor(adjustedScrollY / windowHeight);

        if (
          newPage !== currentPage &&
          newPage >= 0 &&
          newPage < content.length
        ) {
          setFadeIn(false);
          setTimeout(() => {
            setCurrentPage(newPage);
            setFadeIn(true);
          }, 300);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage, windowHeight]);
  const content = [
    {
      img: Chart,
      text: "我的支出都花在哪？",
      content: "多圖表分析",
      contenttwo: "支出收入一目瞭然",
      smalltext: "各式數據圖表，讓您快速掌握每月的消費習慣！",
      smalltexttwo: "此外，切換月份檢視各項交易紀錄，轉帳編輯樣樣來！",
    },
    {
      img: Analysis,
      text: "我想要客製化的理財方向",
      content: "專屬理財規劃師",
      contenttwo: "提供最專業的諮詢",
      smalltext: "透過數據報表，分析您每月的支出收入比率、淨資產分佈。",
      smalltexttwo: "最客製化的分析建議，讓您不再對理財毫無頭緒。",
    },
    {
      img: Project,
      text: "我出去玩不知道花了多少錢",
      content: "開啟記帳專案",
      contenttwo: "掌握您金錢的流向",
      smalltext: "擁有理財專案功能，不管是出遊、結婚、個人儲蓄計畫，",
      smalltexttwo: "通通交給我們，讓您人生的路上，你不孤單。",
    },
  ];
  const testimonials = [
    {
      name: "炸毛企鵝",
      review:
        "MoneyTrack 真的很好用！它幫助我檢視我每天的支出，現在媽媽問我錢花到哪去的時候，我不會在支吾其詞了。謝謝 MoneyTrack 改變我的習慣！",
      avatar:
        "https://diz36nn4q02zr.cloudfront.net/webapi/imagesV3/Original/SalePage/9250833/0/638606291718370000?v=1",
    },
    {
      name: "豆仔",
      review:
        "網頁易於使用且非常直觀，我特別喜歡其帳戶整合功能！以前都不知道自己到底有多少錢錢在身上，總覺得花都花不完，不知不覺就變月光族了。",
      avatar:
        "https://diz36nn4q02zr.cloudfront.net/webapi/imagesV3/Original/SalePage/9556147/0/638437633877100000?v=1",
    },
    {
      name: "棒球",
      review:
        "真的太方便了！離線功能非常實用，我常常去到網路很差的咖啡館，每次都會忘記記帳，後面就越來越懶，現在不管是上山下海，我都可以輕鬆地使用 MoneyTrack。",
      avatar:
        "https://diz36nn4q02zr.cloudfront.net/webapi/imagesV3/Original/SalePage/9890484/0/638556196343770000?v=1",
    },
    {
      name: "沙堡",
      review:
        "我覺得介面其實很好看！而且最特別的是分析功能，居然可以知道我的哪些理財習慣是不好的，真的是太酷了，推薦給所有朋友，一起來用看看吧！",
      avatar:
        "https://diz36nn4q02zr.cloudfront.net/webapi/imagesV3/Original/SalePage/9733662/0/638610363440700000?v=1",
    },
    {
      name: "蘆薈",
      review:
        "我非常滿意這個產品的使用體驗，自從我開始使用記帳後，我發現自己的理財習慣真的改變了！我不再不知道錢花到哪和放到哪，真的很棒！",
      avatar:
        "https://diz36nn4q02zr.cloudfront.net/webapi/imagesV3/Original/SalePage/9597532/0/638500929989470000?v=1",
    },
    {
      name: "扇貝",
      review:
        "真的太方便了！離線功能非常實用，我常常去到網路很差的咖啡館，每次都會忘記記帳，後面就越來越懶，現在不管是上山下海，我都會使用 MoneyTrack。",
      avatar:
        "https://assets.breezeonline.com/online/production/product/bbda77f3-2434-4969-99d4-dd4788e5b0ba.jpg",
    },
    {
      name: "抹茶山",
      review:
        "MoneyTrack 真的很好用！它幫助我檢視我每天的支出，現在爸爸問我錢花到哪去的時候，我不會在支吾其詞了。謝謝 MoneyTrack 改變我的習慣！",
      avatar:
        "https://s2.eslite.com/unsafe/fit-in/x900/s.eslite.com/b2b/newItem/2024/08/01/988_153457412_595_mainCoverImage1.jpg",
    },
  ];

  return (
    <div className="landing-page">
      {/* 第一個區塊 */}

      <div className="flex h-full w-full items-center justify-center">
        <div
          className="h-[80vh] w-full overflow-hidden object-cover text-center"
          style={{
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* <img
            src={bannerImage}
            alt="Banner"
            className="inset-0 h-[80vh] w-full object-cover"
          /> */}
          <div className="ml-[5vw] mt-[10vh] flex flex-col items-start gap-4 pr-6 sm:p-0 xl:mt-[17vh] 3xl:mt-[20vh]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl text-[#9DBEBB] xs:text-3xl xl:text-4xl">
                  用戶
                </h1>
                <h1 className="text-2xl text-white xs:text-3xl xl:text-4xl">
                  好評推薦
                </h1>
              </div>
              <div className="flex gap-3">
                <svg
                  fill="rgb(246, 168, 45)"
                  strokeWidth="0"
                  viewBox="0 0 576 512"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                </svg>
                <svg
                  fill="rgb(246, 168, 45)"
                  strokeWidth="0"
                  viewBox="0 0 576 512"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                </svg>
                <svg
                  fill="rgb(246, 168, 45)"
                  strokeWidth="0"
                  viewBox="0 0 576 512"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                </svg>
                <svg
                  fill="rgb(246, 168, 45)"
                  strokeWidth="0"
                  viewBox="0 0 576 512"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                </svg>
                <svg
                  fill="rgb(246, 168, 45)"
                  strokeWidth="0"
                  viewBox="0 0 576 512"
                  height="24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                </svg>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-[#bbe0e1] xs:text-4xl xl:text-5xl">
              最創新的理財記帳網頁
            </h1>
            <h1 className="mt-2 text-white xl:text-xl">
              最多元的資產管理平台，最方便的記帳工具， 最完整的智慧分析。
            </h1>
          </div>
        </div>
      </div>

      <div>
        <section className="h-[350vh]">
          <div
            ref={horizonRef}
            className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-[#fafafa] pt-[20vh] lg:pt-0"
          >
            <div
              className={`mb-44 flex h-screen w-screen flex-col items-center justify-center gap-20 transition-opacity duration-500 ${
                fadeIn ? "opacity-100" : "opacity-0"
              } lg:mb-0 lg:flex-row lg:pr-28 xl:gap-28`}
            >
              <img
                src={content[currentPage].img}
                alt=""
                className="h-[250px] w-auto xs:h-[350px] sm:h-[400px] lg:h-[300px] xl:h-[500px] 2xl:h-[550px] 3xl:h-[630px]"
              />
              <div className="flex w-[340px] flex-col flex-nowrap xs:w-[400px]">
                <p className="mb-4 text-xl font-semibold text-[#bbe0e1] sm:text-2xl xl:text-3xl">
                  {content[currentPage].text}
                </p>
                <p className="text-nowrap text-4xl font-semibold xs:text-5xl xs:leading-tight 3xl:text-6xl 3xl:leading-snug">
                  {content[currentPage].content}
                  <br />
                  {content[currentPage].contenttwo}
                </p>
                <p className="mt-4 text-sm leading-snug text-[#374151] xs:text-lg xl:text-2xl">
                  {content[currentPage].smalltext}

                  {content[currentPage].smalltexttwo}
                </p>
              </div>
              <div className="flex flex-col justify-center gap-2">
                {content.map((_, index) => (
                  <div
                    key={index}
                    className={`mx-2 h-2 w-2 rounded-full transition duration-300 xl:h-3 xl:w-3 ${currentPage === index ? "bg-gray-600" : "bg-gray-400"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* 點點導航 */}
        </section>
        {/* 最后一部分 */}
        {/* 第一部分 */}
        <section className="h-auto bg-[#fafafa] pt-[10vh] lg:pt-0">
          <div className="flex h-full flex-col items-center gap-7">
            <h1 className="text-4xl font-semibold lg:text-6xl">更多特色</h1>
            <div className="flex h-[50%] flex-col items-center gap-3 rounded-lg lg:flex-row">
              {[
                {
                  title: "自定義佈局",
                  description:
                    "財務儀表板擺脫傳統排版，您可以根據自己習慣、喜歡的使用方式去拖拉介面，讓記帳更輕鬆！",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="rgb(246, 168, 45)"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="size-8 lg:size-11"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  ),
                },
                {
                  title: "帳戶整合",
                  description:
                    "統整各帳戶、信用卡的資產分佈，並且可以查看帳戶底下的交易紀錄，隨時進行淨資產統計。",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="rgb(246, 168, 45)"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="size-8 lg:size-11"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "離線使用",
                  description:
                    "經常在餐廳連不到網路嗎? MoneyTrack 離線時也能繼續使用，您再也找不到不記帳的藉口！",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="rgb(246, 168, 45)"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="size-8 lg:size-11"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "轉帳交易",
                  description:
                    "在 MoneyTrack 中您可以輕鬆紀錄轉帳，因為我們提供「轉帳」功能，讓你資產轉移不再煩惱！",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="rgb(246, 168, 45)"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="size-8 lg:size-11"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                  ),
                },
              ].map(({ title, description, svg }, index) => (
                <div
                  ref={firstRef}
                  key={index}
                  className={`flex h-full w-[80vw] transform flex-col items-center justify-center gap-3 rounded-3xl border bg-white px-7 py-3 text-3xl shadow-md transition duration-700 hover:bg-gray-100 lg:w-[20vw] lg:gap-5 ${
                    firstInView
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  {svg}
                  <p className="flex items-center text-xl font-semibold lg:text-2xl">
                    {title}
                  </p>
                  <p className="text-base text-[#374151] xl:text-lg">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="h-auto bg-[#fafafa] py-[10vh]">
          <div className="flex h-full flex-col items-center gap-5">
            <h1 className="text-4xl font-semibold lg:text-6xl">好評推薦</h1>
            <h2 className="ml-[5vh] self-start rounded-lg bg-[#bbe0e1] p-2 font-semibold text-white sm:ml-[10vh] lg:ml-[20vh]">
              MoneyTrack 用戶這麽說
            </h2>
            <h2 className="mb-2 ml-[5vh] self-start rounded-lg px-2 font-semibold sm:ml-[10vh] lg:ml-[20vh] lg:text-xl">
              使用者真實評價
            </h2>
            <Carousel className="max-w-7xl lg:w-[80vw]">
              <CarouselContent className="mx-auto w-[60vw] sm:w-[80vw] lg:w-[50vw]">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    // className="pl-1 md:basis-1/2 lg:basis-1/3"
                  >
                    <Card
                      className={`m-2 h-96 w-48 rounded-3xl border bg-white shadow-md transition duration-700 sm:h-80 sm:w-72 lg:h-96 lg:w-72 ${
                        secondInView
                          ? "translate-y-0 opacity-100"
                          : "translate-y-10 opacity-0"
                      }`}
                    >
                      <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-7">
                        <img
                          src={testimonial.avatar}
                          alt={`${testimonial.name} avatar`}
                          className="mb-4 h-16 w-16 rounded-full md:h-24 md:w-24"
                        />
                        <p className="text-lg font-semibold md:text-2xl">
                          {testimonial.name}
                        </p>
                        <p className="justify-self-start text-base text-gray-700 lg:text-lg">
                          {testimonial.review}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div ref={secondRef} />
          </div>
        </section>
        <section className="flex h-auto flex-col items-center justify-center gap-10 bg-[#222E50] p-7 text-sm text-white lg:text-lg">
          <div className="it flex justify-center gap-10">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[#bbe0e1]">麻布追蹤</p>
              <p>關於我們</p>
              <p>粉絲專頁</p>
              <p>臉書社團</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[#bbe0e1]">客戶服務</p>

              <p>隱私權政策</p>
              <p>資訊安全政策</p>
              <p>聯絡我們</p>
            </div>
          </div>
          <p className="">
            © 2024 MoneyTrack Corp., Ltd. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  );
}
{
  /* 横向滚动的部分 */
}
{
  /* <section className="h-[500vh]">
          <div
            ref={horizonRef}
            className="sticky top-0 flex max-h-screen overflow-x-hidden whitespace-nowrap bg-slate-500"
          >
            <div className="flex h-screen w-screen flex-none items-center justify-center bg-slate-300">
              <div className="flex h-full items-center justify-center">
                <img src={chart} alt="" className="max-h-[100vh] w-auto" />
                <div>
                  <p className="mb-4 text-3xl font-semibold text-[#446f5d]">
                    我的支出都花在哪？
                  </p>
                  <p className="text-6xl leading-snug">
                    多圖表分析
                    <br />
                    支出收入比例一目瞭然
                  </p>
                  <p className="mt-4 text-2xl leading-snug text-gray-600">
                    包括收入、支出分布圖表，讓您可以快速的掌握自己每月的消費習慣！
                    <br />
                    提供您自定義佈局儀表板，讓您從理財小白瞬間升級。
                  </p>
                </div>
              </div>
            </div>
            <div className="flex h-screen w-screen flex-none items-center justify-center bg-green-300">
              <div className="flex h-full items-center justify-center">
                <img src={chat} alt="" className="max-h-[100vh] w-auto" />
                <div>
                  <p className="mb-4 text-3xl font-semibold text-[#446f5d]">
                    我想要客製化的理財方向
                  </p>
                  <p className="text-6xl leading-snug">
                    專屬理財規劃師
                    <br />
                    提供最專業的諮詢
                  </p>
                  <p className="mt-4 text-2xl leading-snug text-gray-600">
                    透過數據報表，分析您每月的支出收入比率、淨資產分佈
                    <br />
                    最客製化的分析建議，讓您不再對理財毫無頭緒。
                  </p>
                </div>
              </div>
            </div>
            <div className="flex h-screen w-screen flex-none items-center justify-center bg-blue-300">
              <div className="flex h-full items-center justify-center">
                <img src={project} alt="" className="max-h-[100vh] w-auto" />
                <div>
                  <p className="mb-4 text-3xl font-semibold text-[#446f5d]">
                    我每次出去玩都不知道自己花了多少錢
                  </p>
                  <p className="text-6xl leading-snug">
                    開啟記帳專案
                    <br />
                    掌握你的金錢的流向
                  </p>
                  <p className="mt-4 text-2xl leading-snug text-gray-600">
                    擁有理財專案的功能，不管是出遊、結婚、個人儲蓄計畫
                    <br />
                    通通可以交給 MoneyTrack。
                  </p>
                </div>
              </div>
            </div> */
}
{
  /* <div className="flex h-screen w-screen flex-none items-center justify-center">
              <span className="text-4xl">HORIZONTAL 🎉</span>
            </div>
            <div className="flex h-screen w-screen flex-none items-center justify-center">
              <div className="text-6xl">🏄 OH YA BABY 🏄</div>
            </div> */
}
{
  /* </div>
        </section> */
}

{
  /* 第三個區塊 - 產品展示 */
}
{
  /* <motion.section
        className="flex flex-col items-center justify-center bg-gray-100 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="mb-8 text-4xl font-bold text-gray-800">
          我們的產品
        </motion.h2>
        <div className="grid grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-[300px] w-[400px] rounded-lg bg-gray-300 shadow-md"
              variants={imageVariants}
            >
              <span className="text-center text-xl">產品圖 {i}</span>
            </motion.div>
          ))}
        </div>
      </motion.section> */
}

{
  /* 第四個區塊 - CTA 區塊 */
}
{
  /* <motion.section
        className="flex h-screen flex-col items-center justify-center bg-white py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="mb-8 text-4xl font-bold text-gray-800">
          準備好開始了嗎？
        </motion.h2>
        <motion.p className="mb-4 text-xl text-gray-600">
          與我們一起創造未來。
        </motion.p>
        <motion.button
          className="rounded-lg bg-yellow-500 px-8 py-3 text-white shadow-lg transition-transform duration-300 hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          立即開始
        </motion.button>
      </motion.section> */
}
