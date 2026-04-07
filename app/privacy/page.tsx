import Link from 'next/link';

const sections = [
  {
    title: 'Information We Collect',
    content: [
      'Account information such as your name, email address, and password when you register.',
      'Usage data including pages visited, movies browsed, reviews submitted, and watchlist activity.',
      'Device and browser information collected automatically through cookies and similar technologies.',
      'Payment information when you subscribe to a premium plan, processed securely through our payment provider.',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: [
      'To provide and maintain our movie portal services, including personalized recommendations.',
      'To process your account registration, subscriptions, and transactions.',
      'To communicate with you about updates, new features, and promotional offers.',
      'To analyze usage trends and improve the overall user experience of our platform.',
      'To enforce our terms of service and protect against fraudulent or unauthorized activity.',
    ],
  },
  {
    title: 'Data Security',
    content: [
      'We implement industry-standard security measures to protect your personal information.',
      'All data transmitted between your browser and our servers is encrypted using SSL/TLS protocols.',
      'Access to personal data is restricted to authorized personnel on a need-to-know basis.',
      'While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.',
    ],
  },
  {
    title: 'Cookies',
    content: [
      'We use cookies and similar tracking technologies to enhance your browsing experience.',
      'Essential cookies are required for the site to function properly, such as maintaining your login session.',
      'Analytics cookies help us understand how visitors interact with our platform so we can improve it.',
      'You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect site functionality.',
    ],
  },
  {
    title: 'Third-Party Services',
    content: [
      'We may use third-party services for payment processing, analytics, and content delivery.',
      'These services have their own privacy policies, and we encourage you to review them.',
      'We do not sell your personal information to third parties.',
      'Third-party links on our platform are not covered by this privacy policy. We are not responsible for their content or practices.',
    ],
  },
  {
    title: 'Contact Us',
    content: [
      'If you have any questions or concerns about this privacy policy, please reach out to us.',
      'Email: support@recape.com',
      'You may also visit our Contact page for additional ways to get in touch.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Privacy <span className="text-red-500">Policy</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Last updated: April 7, 2026
          </p>
        </div>

        {/* Intro */}
        <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 mb-10">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            At <span className="text-red-500 font-semibold">Recape</span>, we are committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our movie portal
            platform. By using our services, you agree to the practices described in this policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, index) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-red-600/10 text-red-500 rounded-lg flex items-center justify-center text-sm font-bold shrink-0">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <ul className="space-y-3 pl-11">
                {section.content.map((item, i) => (
                  <li key={i} className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-14 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Have questions?{' '}
            <Link href="/contact" className="text-red-500 hover:text-red-400 font-semibold transition">
              Contact us
            </Link>{' '}
            and we&rsquo;ll be happy to help.
          </p>
        </div>
      </div>
    </div>
  );
}
