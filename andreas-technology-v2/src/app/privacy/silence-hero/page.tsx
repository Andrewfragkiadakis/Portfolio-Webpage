'use client';

import React from 'react';
import Navigation from '@/components/dom/Navigation';
import { motion } from 'framer-motion';

export default function SilenceHeroPrivacy() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
            <Navigation />

            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        Privacy Policy for Silence Hero
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
                            <p>
                                Silence Hero ("the Extension") is a Chrome/Edge browser extension designed to help users in Greece stay informed about official quiet hours.
                                Your privacy is of the utmost importance to us. This policy describes how we handle data within the extension.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Zero Data Collection</h2>
                            <p className="border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-500/5">
                                <strong>Silence Hero does not collect, store, or transmit any personally identifiable information, browsing history, or user data.</strong>
                            </p>
                            <ul className="list-disc list-inside mt-4 space-y-2">
                                <li>No data is sent to external servers.</li>
                                <li>No tracking cookies or analytics are used.</li>
                                <li>No account registration is required.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
                            <p>
                                All logic and time calculations are performed locally on your device within the browser's sandbox.
                                The extension uses the following permissions for specific functional purposes:
                            </p>
                            <ul className="list-disc list-inside mt-4 space-y-2">
                                <li><strong>Storage:</strong> To save your notification preferences and theme settings locally on your computer.</li>
                                <li><strong>Notifications:</strong> To alert you when quiet hours start or end (if enabled in settings).</li>
                                <li><strong>Alarms:</strong> To trigger the status updates at the correct times.</li>
                                <li><strong>Offscreen:</strong> Used locally for pulsing icon animations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
                            <p>
                                Silence Hero does not integrate with any third-party services. There is no interaction with advertisements or data brokers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
                            <p>
                                If you have any questions regarding this privacy policy, you can contact the developer at:
                                <a href="mailto:andrewfragkiadakis@gmail.com" className="text-blue-400 hover:text-blue-300 ml-1 underline transition-colors">
                                    andrewfragkiadakis@gmail.com
                                </a>
                            </p>
                        </section>

                        <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
                            Last Updated: January 17, 2026
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
