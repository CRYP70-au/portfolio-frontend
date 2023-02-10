import Image from 'next/image'



export default function BlogLink(props) {
    return (
        <div class="p-4 md:w-1/3">
        <div class="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <Image src={props.image} alt="blog" width={0} height={0}/>
            <div class="p-6">
                <h2 class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">CATEGORY</h2>
                <h1 class="title-font text-lg font-medium text-gray-900 mb-3">{props.name}</h1>
                <p class="leading-relaxed mb-3">{props.description}</p>
                <div class="flex items-center flex-wrap ">
                    <a class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0" href={props.link} target="_blank" rel="noopener noreferrer">View Finding
                    <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                    </svg>
                    </a>
                </div>
            </div>
        </div>  
      </div>
    )
}