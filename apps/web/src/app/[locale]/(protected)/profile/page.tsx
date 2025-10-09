'use client';

import Image from 'next/image';

export default function WebsiteTemplatesSection() {
    return (
        <section className="custom-screen relative z-10 pt-32 px-10 h-[2000px]">
            <div className="max-w-2xl mx-auto space-y-4 flex items-center justify-center flex-col text-center text-balance">
                <h2 className="text-4xl heading font-extrabold">Professional website templates</h2>
                <p className=" max-w-xl">
                    A collection of professional and beautifully designed website templates, built
                    on top of React, Next.js with Tailwind CSS.
                </p>
            </div>
            <div className="gap-x-6 mt-10 space-y-6 md:flex md:space-y-0">
                <div className="flex-1 relative overflow-hidden border border-zinc-200 rounded-2xl p-8 bg-[linear-gradient(180deg,_rgba(15,_23,_42,_0.65)_0%,_rgba(24,_24,_27,_0.00)_100%)]">
                    <h3 className="font-semibold">Ready to use templates</h3>
                    <p className="max-w-md mt-3">
                        Explore pre-designed templates to quickly begin building your application or
                        website.
                    </p>
                    <div className="flex mt-8 group h-52 sm:h-64 md:h-auto">
                        <Image
                            alt=""
                            loading="lazy"
                            width="472"
                            height="257"
                            decoding="async"
                            className="flex-1 absolute group-hover:right-60 right-24 -bottom-6 duration-500"
                            style={{ color: 'transparent' }}
                            src="https://floatui.com/_next/static/media/preview-2.95eea371.svg"
                        />
                        <Image
                            alt=""
                            loading="lazy"
                            width="470"
                            height="256"
                            decoding="async"
                            className="flex-1 absolute group-hover:right-32 right-12 bottom-0 duration-500"
                            style={{ color: 'transparent' }}
                            src="https://floatui.com/_next/static/media/preview-3.ed92aa03.svg"
                        />
                        <Image
                            alt=""
                            loading="lazy"
                            width="472"
                            height="257"
                            decoding="async"
                            className="flex-1 absolute group-hover:-right-12 -right-20 bottom-0 duration-500"
                            style={{ color: 'transparent' }}
                            src="https://floatui.com/_next/static/media/preview-1.7abcb728.svg"
                        />
                    </div>
                </div>
                <div className="flex-none border border-zinc-200 rounded-2xl p-8 bg-[linear-gradient(180deg,_rgba(15,_23,_42,_0.65)_0%,_rgba(24,_24,_27,_0.00)_100%)] w-full md:max-w-sm lg:max-w-md">
                    <h3 className="font-semibold">Good template scores</h3>
                    <p className="mt-3 max-w-sm">
                        Our templates are made to be super fast, easy for everyone to use, and show
                        up well on search engines.
                    </p>
                    <div className="mt-8">
                        <div className="relative w-52 h-52 mx-auto rounded-full bg-green-500 flex items-center justify-center">
                            <svg viewBox="0 0 36 36" className="w-44 h-44 absolute">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#047857"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeDasharray="100, 100"
                                ></path>
                            </svg>
                            <svg viewBox="0 0 36 36" className="w-44 h-44 relative z-10">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#FFF"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeDasharray="95, 100"
                                ></path>
                            </svg>
                            <span className="absolute font-extrabold text-6xl text-transparent bg-clip-text bg-[linear-gradient(180deg,_#FAFAFA_0%,_rgba(250,_250,_250,_0.00)_332.5%)]">
                                95
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
