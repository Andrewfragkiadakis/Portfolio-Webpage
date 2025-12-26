'use client'
import { useContent } from '@/hooks/useContent'
import { useLanguage } from '@/contexts/LanguageContext'
import { memo } from 'react'

function Contact() {
    const t = useContent()
    const { language } = useLanguage()

    const cvLink = "https://drive.google.com/uc?export=download&id=1b-GiyMU1D_6yxr70bmpufj_kIqKgW38A"

    return (
        <section id="contact" className="h-screen snap-start bg-white dark:bg-zinc-950 text-black dark:text-white px-4 sm:px-6 md:px-8 flex flex-col justify-center relative">
            <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 md:mb-12">{t.contactTitle}</h2>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-8 sm:gap-12 items-start">
                    {/* Contact Details */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-zinc-600 dark:text-zinc-400">
                            CONTACT
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-zinc-500 mb-1">Location</div>
                                <div className="text-lg flex items-center gap-2">
                                    <i className="fas fa-map-marker-alt text-black dark:text-white"></i>
                                    {t.location}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-zinc-500 mb-1">Phone</div>
                                <a
                                    href={`tel:${t.phone.replace(/\D/g, '')}`}
                                    className="text-lg flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                                >
                                    <i className="fas fa-phone text-black dark:text-white"></i>
                                    {t.phone}
                                </a>
                            </div>
                            <div>
                                <div className="text-sm text-zinc-500 mb-1">Email</div>
                                <a
                                    href={`mailto:${t.email}`}
                                    className="text-lg flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors cursor-pointer break-all"
                                >
                                    <i className="fas fa-envelope text-black dark:text-white"></i>
                                    {t.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-6 text-zinc-600 dark:text-zinc-400">Links</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-zinc-500 mb-1 opacity-0">Social</div>
                                <a
                                    href={t.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-lg hover:text-black dark:hover:text-white transition-colors cursor-pointer group"
                                >
                                    <i className="fab fa-github text-2xl group-hover:scale-110 transition-transform"></i>
                                    <span>GitHub</span>
                                </a>
                            </div>
                            <div>
                                <div className="text-sm text-zinc-500 mb-1 opacity-0">Social</div>
                                <a
                                    href={t.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-lg hover:text-black dark:hover:text-white transition-colors cursor-pointer group"
                                >
                                    <i className="fab fa-linkedin text-2xl group-hover:scale-110 transition-transform"></i>
                                    <span>LinkedIn</span>
                                </a>
                            </div>
                            <div>
                                <div className="text-sm text-zinc-500 mb-1 opacity-0">Document</div>
                                <a
                                    href={cvLink}
                                    download
                                    className="flex items-center gap-3 text-lg hover:text-black dark:hover:text-white transition-colors cursor-pointer group"
                                >
                                    <i className="fas fa-file-download text-2xl group-hover:scale-110 transition-transform"></i>
                                    <span>Download CV</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* QR Code - Theme Aware */}
                    <div className="hidden lg:flex flex-col items-center">
                        {/* Spacer to align QR code with the first link (GitHub) */}
                        {/* We only duplicate the header so the QR code starts at the same level as the first link item */}
                        <div className="invisible pointer-events-none" aria-hidden="true">
                            <h3 className="text-2xl font-semibold mb-6">Links</h3>
                        </div>

                        <div className="relative">
                            {/* Light mode QR code */}
                            <img
                                src="/images/QR Codes/qr-code-for white-background.png"
                                alt="QR Code"
                                className="w-48 h-48 dark:hidden rounded-lg"
                            />
                            {/* Dark mode QR code */}
                            <img
                                src="/images/QR Codes/qr-code-for-dark-background.png"
                                alt="QR Code"
                                className="w-48 h-48 hidden dark:block rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full border-t border-zinc-300 dark:border-zinc-800 py-2 text-center text-zinc-500 text-sm mt-auto">
                {t.copyright}
            </div>
        </section>
    )
}

export default memo(Contact)
