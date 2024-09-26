import bannerImage from "../../../public/banner.jpg";
import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/card";

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
    threshold: 0.4,
  });
  const { ref: secondRef, inView: secondInView } = useInView({
    triggerOnce: true,
    threshold: 0.4,
  });
  const horizonRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const windowHeight = window.innerHeight;
  console.log(window.innerHeight);
  console.log(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (horizonRef.current) {
        const scrollY = window.scrollY;

        const contentOffset = window.innerHeight;

        const adjustedScrollY = scrollY - contentOffset;

        const newPage = Math.floor(adjustedScrollY / windowHeight);

        if (newPage !== currentPage && newPage >= 0 && newPage < 3) {
          setCurrentPage(newPage);
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
      img: "../../../public/chart.gif",
      text: "我的支出都花在哪？",
      content: "多圖表分析",
      contenttwo: "支出收入比例一目瞭然",
      smalltext: "各式數據圖表，讓您快速掌握每月的消費習慣！",
      smalltexttwo: "最客製化的分析建議，讓您不再對理財毫無頭緒。",
    },
    {
      img: "../../../public/analysis.gif",
      text: "我想要客製化的理財方向",
      content: "專屬理財規劃師",
      contenttwo: "提供最專業的諮詢",
      smalltext: "透過數據報表，分析您每月的支出收入比率、淨資產分佈",
      smalltexttwo: "最客製化的分析建議，讓您不再對理財毫無頭緒。",
    },
    {
      img: "../../../public/project.gif",
      text: "我每次出去玩都不知道自己花了多少錢",
      content: "開啟記帳專案",
      contenttwo: "掌握您金錢的流向",
      smalltext: "擁有理財專案的功能，不管是出遊、結婚、個人儲蓄計畫",
      smalltexttwo: "通通可以交給 MoneyTrack。",
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
  ];

  return (
    <div className="landing-page">
      {/* 第一個區塊 */}

      <div className="flex h-full w-full items-center justify-center">
        <div className="h-full w-full overflow-hidden rounded-xl bg-gray-400 text-center">
          <img
            src={bannerImage}
            alt="Banner"
            className="absolute inset-0 h-[80vh] w-full object-cover"
          />
          <div className="absolute left-[200px] top-[200px] flex flex-col items-start gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl text-[#9DBEBB]">4.8 </h1>
                <h1 className="text-4xl text-white"> 顆星好評推薦</h1>
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

            <h1 className="mt-4 text-5xl font-semibold text-[#bbe0e1]">
              最創新的理財記帳網頁
            </h1>
            <h1 className="mt-2 text-xl text-white">
              最多元的資產管理平台，最方便的記帳工具， 最完整的智慧分析。
            </h1>
          </div>
        </div>
      </div>

      <div>
        <section className="mt-[80vh] h-[350vh]">
          <div
            ref={horizonRef}
            className="sticky top-0 flex max-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafafa]"
          >
            <div className="flex h-screen w-screen items-center justify-center gap-40">
              <img
                src={content[currentPage].img}
                alt=""
                className="h-[60vh] w-auto"
              />
              <div>
                <p className="mb-4 text-3xl font-semibold text-[#bbe0e1]">
                  {content[currentPage].text}
                </p>
                <p className="text-6xl font-semibold leading-snug">
                  {content[currentPage].content}
                  <br />
                  {content[currentPage].contenttwo}
                </p>
                <p className="mt-4 text-2xl leading-snug text-[#374151]">
                  {content[currentPage].smalltext}
                  <br />
                  {content[currentPage].smalltexttwo}
                </p>
              </div>
              <div className="flex flex-col justify-center gap-2">
                {content.map((_, index) => (
                  <div
                    key={index}
                    className={`mx-2 h-3 w-3 rounded-full transition duration-300 ${currentPage === index ? "bg-gray-600" : "bg-gray-400"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* 點點導航 */}
        </section>
        {/* 最后一部分 */}
        {/* 第一部分 */}
        <section className="h-[60vh] bg-[#fafafa]">
          <div className="flex h-full flex-col items-center gap-7">
            <h1 className="text-6xl font-semibold">更多特色</h1>
            <div className="flex h-[50%] items-center gap-3 rounded-xl">
              {[
                {
                  title: "自定義佈局",
                  description:
                    "財務儀表板擺脫傳統固定式排版，您可以根據自己習慣、喜歡的使用方式去拖拉介面，讓記帳更輕鬆！",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="rgb(246, 168, 45)"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="size-11"
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
                      className="size-11"
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
                    "經常在餐廳連不到網路嗎? 沒事，MoneyTrack 在離線時也可以使用，您再也找不到不記帳的藉口！",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="rgb(246, 168, 45)"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="size-11"
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
                    "在 MoneyTrack 中您不需要擔心轉帳如何記帳，因為我們提供全新「轉帳」功能，讓你資產轉移不再煩惱！",
                  svg: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="rgb(246, 168, 45)"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      className="size-11"
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
                  className={`flex h-full w-[20vw] transform flex-col items-center justify-center gap-5 rounded-3xl border bg-white p-9 text-3xl shadow-md transition duration-700 hover:bg-gray-100 ${
                    firstInView
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  {svg}
                  <p className="flex items-center text-2xl font-semibold">
                    {title}
                  </p>
                  <p className="text-lg text-[#374151]">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="h-[50vh] bg-[#fafafa]">
          <div className="flex h-full flex-col items-center gap-7">
            <h1 className="text-6xl font-semibold">好評推薦</h1>
            <Carousel className="w-full max-w-7xl">
              <CarouselContent className="-ml-1">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-1 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card
                        className={`h-96 w-auto rounded-3xl border bg-white shadow-md transition duration-700 ${
                          secondInView
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                        }`}
                      >
                        <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-9">
                          <img
                            src={testimonial.avatar}
                            alt={`${testimonial.name} avatar`}
                            className="mb-4 h-24 w-24 rounded-full"
                          />
                          <p className="t text-2xl font-semibold">
                            {testimonial.name}
                          </p>
                          <p className="justify-self-start text-lg text-gray-700">
                            {testimonial.review}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div ref={secondRef} />
          </div>
        </section>
        <section className="flex h-auto flex-col items-center justify-center gap-10 bg-[#222E50] p-7 text-lg text-white">
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
