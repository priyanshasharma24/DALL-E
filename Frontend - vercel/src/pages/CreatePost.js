import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";
import axios from "axios";

const CreatePost = () => {
  const navigate = useNavigate();
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creditLeft, setCreditLeft] = useState(0); 

  useEffect(() => {
    fetchCreditLeft();
  }, []);

  
  const fetchCreditLeft = async () => {
    try {
      const res = await axios.get("https://dall-e-eta.vercel.app/api/v1/dalle/credit-left");
      setCreditLeft(res.data.creditLeft)
    } catch (error) {
      console.error(error);
    }
  };

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const handleSubmit = async(e) =>{
    e.preventDefault()
    if(form.prompt && form.photo){
      setLoading(true)
      try {
        const res = await axios.post('https://dall-e-eta.vercel.app/api/v1/post',{form});
        console.log(res)
        
        navigate('/');
      } catch (error) {
        alert(error)
      }finally{
        setLoading(false)
      }
    }else{
      alert("please enter a prompt")
    }
  }

  const generateImg = async() =>{
    if(form.prompt){
      try {
        setGeneratingImg(true)
 
      const res = await axios.post("https://dall-e-eta.vercel.app/api/v1/dalle",{form})
      
      const data = res.data;
      // setForm({...form,photo:`data:image/jpeg;base64,${data.photo}`})
      setForm({...form,photo:data.photo.generated_image})
      setCreditLeft(data.creditLeft);
      } catch (error) {
        alert(error.response.data?.message)
      }finally{
        setGeneratingImg(false);
      }
    }else{
      alert("please enter a prompt")
    }
  }

  const handleChange =(e) =>{
    setForm({...form,[e.target.name]: e.target.value})
  }

  const handleSurpriseMe =() =>{
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({...form,prompt:randomPrompt})
  }


  return (
    <section className="max-w-7x1 mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Create
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Create Through a collection of imaginative and visually stunning
          images Through DALL-E AI and share them with the community
        </p>
      </div>

      <form action="mt-16 max-w-3x1" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField LabelName="Your name"
          type="text"
          name="name"
          placeholder="john Doe"
          value={form.name}
          handleChange={handleChange}/>

          <FormField LabelName="Prompt"
          type="text"
          name="prompt"
          placeholder="an oil pastel drawing of an annoyed cat in a spaceship"
          value={form.prompt}
          handleChange={handleChange}
          isSurpriseMe
          handleSurpriseMe={handleSurpriseMe}/>

          <div className="relative bg-grey-50 
          border-grey-300 text-grey-900
          text-grey-900 text-sm rounded-lg focus:rind-blur-500
           focus:border-blue-500 w-64 p-3 h-64 flex justify-center 
           items-center">
            {form.photo ? (
              <img src={form.photo} alt={form.prompt}
              className="w-full h-full object-contain " />
            ):(
              <img src={preview} alt="priview"
              className="w-9/12 h-9/12 object-contain opacity-40" />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center
              items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader/>
              </div>
            )}
           </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button type="button"
          onClick={generateImg}
          disabled={generatingImg}
          className="text-white bg-green-700 font-medium rounded-md
          text-sm w-full sm:w-auto  px-5 py-2.5 text-center">
            {generatingImg ? "Generating..." : "Generate"}
          </button>
          {creditLeft !== undefined && (
          <p className="text-[18px] flex justify-center items-center">
            Credits Left: {creditLeft} {generatingImg ? ".Expected time 1 min, Please be patient..." : ""} 
          </p>
        )}
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            once you have created the image you want, you can
            share it share it with others in the community</p>
            <button type="submit" className="mt-3 text-white 
            bg-[#6469ff] font-medium rounded-md text-sm w-full
            sm:w-auto px-5 py-2.5 text-center">
              {loading ? "Sharing..." :"Share with the community"}
            </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
