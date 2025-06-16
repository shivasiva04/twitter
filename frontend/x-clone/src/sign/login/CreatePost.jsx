import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BaseUrl from '../../constant/Url';

export const CreatePost = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);
  
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`${BaseUrl}/api/posts/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create post');
      }

      return res.json();
    },
    onSuccess: () => {
      setText('');
      setImage(null);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    

  });



  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', text);
    if (image) {
      formData.append('image', image); 
      console.log('Appending image:', image.name); 
    } else {
      console.warn('Image is null when submitting'); 
    }

    createPost(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      console.log('Image selected:', file.name); 
    }
  };



  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mb-5 mx-auto mt-6 p-4 border rounded-lg shadow-md w-full bg-white"
    >
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border rounded-md resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        // rows={4}
      />

      {image && (
        <div className="mb-4">
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="max-h-40 object-contain rounded-md"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={imageRef}
        onChange={handleImageChange}
        hidden
      />

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => imageRef.current.click()}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Upload Image
        </button>
       
        
        <button
          type="submit"
          disabled={isPending}
          className={`px-6 py-2 rounded-md text-white ${
            isPending
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isPending ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};
