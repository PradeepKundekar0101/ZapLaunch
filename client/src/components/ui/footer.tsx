import { Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-lg font-bold text-white mb-4">About LaunchPilot</h3>
            <p className="text-sm">
              LaunchPilot simplifies deployment for developers, providing seamless GitHub integration, real-time monitoring, and visitor analytics. Empower your apps to go live effortlessly!
            </p>
          </div>


          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Features</a></li>
              <li><a href="#" className="hover:underline">Pricing</a></li>
              <li><a href="#" className="hover:underline">FAQs</a></li>
              <li><a href="#" className="hover:underline">Support</a></li>
            </ul>
          </div>


          <div>
            <h3 className="text-lg font-bold text-white mb-4">Connect with Us</h3>
            <p className="text-sm mb-4">Stay updated with LaunchPilot on our social platforms.</p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" aria-label="Twitter" className="hover:text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com" aria-label="GitHub" className="hover:text-white">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-white">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} LaunchPilot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
