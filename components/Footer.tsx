export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-red-900 text-gray-400 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <img src="/logo.svg" alt="Recape Movie" className="h-10" />
        </div>
        <p className="text-sm">Your ultimate destination for movie reviews and ratings.</p>
        <p className="text-xs mt-4">© {new Date().getFullYear()} Recape Movie. All rights reserved.</p>
      </div>
    </footer>
  );
}
