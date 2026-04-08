export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-snow flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  );
}
