import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function ProfileSettings() {
  const { user, updateUser } = useContext(AuthContext);
  const [bio, setBio] = useState(user.bio || '');
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profilePicUrl = user.profilePic;
    if (profilePic) {
      profilePicUrl = await uploadToCloudinary(profilePic);
    }
    await updateUser({ bio, profilePic: profilePicUrl });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
}