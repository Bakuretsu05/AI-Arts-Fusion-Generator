interface ImageDisplayProps {
  imageUrl: string | null;
  loading: boolean;
}

export default function ImageDisplay({ imageUrl, loading }: ImageDisplayProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-gray-100 p-8">
        <span className="text-sm text-gray-500">Generating image…</span>
      </div>
    );
  }
  if (!imageUrl) return null;
  return (
    <div className="mt-4">
      <img
        src={imageUrl}
        alt="Generated fusion concept"
        className="w-full rounded-lg object-cover shadow"
      />
    </div>
  );
}
