import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { CameraIcon } from "@heroicons/react/outline";
import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { useSession } from "next-auth/react";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";

const Modal = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = useRef();
  const captionRef = useRef();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);
    // 1) Create a Post and add to firestore
    const docRef = await addDoc(collection(db, "posts"), {
      username: session.user.username,
      userId: session.user.uid,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    });
    // 2) get the postId from newly created post
    const postId = docRef.id;
    // 3) upload the image to firebase storage with the post ID
    const imageRef = ref(storage, `posts/${postId}/image`);
    await uploadString(imageRef, selectedFile, "data_url");
    // 4) get a download URL from fb storage and update the orginal post
    const donwloadURL = await getDownloadURL(imageRef);
    await updateDoc(docRef, { image: donwloadURL });

    setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-auto"
        onClose={() => setOpen(false)}
      >
        <div
          className="flex items-end justify-center min-h-[800px] 
          pt-4 px-4 pb-20 text-center
          sm:min-h-screen sm:block sm:p-0
       "
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="
                fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity
                "
            />
          </Transition.Child>
          <span
            className="
            hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block bg-white rounded-lg
             px-4 pt-5 pb-4
              text-left overflow-hidden
             shadow-xl transform transition-all 
             sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6
            "
            >
              <div>
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    alt=""
                    className="w-full object-contain cursor-pointer"
                    onClick={() => setSelectedFile(null)}
                  />
                ) : (
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer">
                    <CameraIcon
                      onClick={() => filePickerRef.current.click()}
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Upload a photo
                  </Dialog.Title>
                  <div>
                    <input
                      ref={filePickerRef}
                      onChange={addImageToPost}
                      type="file"
                      hidden
                    />
                  </div>
                  <div>
                    <input
                      className="border-none focus:ring-0 w-full text-center"
                      type="text"
                      ref={captionRef}
                      placeholder="Please enter a caption..."
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    disabled={!selectedFile || loading}
                    onClick={uploadPost}
                    className="inline-flex justify-center w-full rounded-md
                   border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white
                   hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed
                     disabled:hover:bg-gray-300
                  "
                  >
                    {loading ? "Uploading..." : "Upload Post"}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
