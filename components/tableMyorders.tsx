import { image, Image } from "@heroui/react";
const bloge=[
    {
        idBlog: 1,
        tema: "Blog 1",
        categoria: "Tecnología",
        imagen: "https://i.ibb.co/6m6q2sX/blog-1.png",
    }
]

export default function TableMyOrders() {
    return (
        <div className="max-h-[500px] overflow-y-auto overflow-scroll:scrollbar-none">
          <table className="w-full border-separate border-spacing-y-4 ">
            <thead className="rounded-full">
              <tr className="bg-[#6364F4] text-white h-11 ">
                <th className="rounded-tl-full font-normal">ID</th>
                <th className="font-normal">Order</th>
                <th className="font-normal">date</th>
                <th className="font-normal">Products</th>
                <th className=" font-normal">Final price</th>
                <th className="rounded-tr-full font-normal">Options</th>
              </tr>
            </thead>
    
            <tbody className="text-center   bg-white text-[#634AE2] font-normal text-[16px] leading-[20px]  ">
              {bloge.map((blog) => (
                <tr key={blog.idBlog} className="border-b hover:bg-gray-100  ">
                  <td className="px-4 py-2 rounded-l-[34px]">{blog.idBlog}</td>
                  <td
                    className="px-4 py-2 "
                    
                  >{blog.tema}</td>
                  <td className="px-4 py-2">{blog.categoria}</td>
                  <td className="px-4 py-2 flex justify-center items-center">
                    <Image
                      isZoomed
                      width={120}
                      height={70}
                      radius="none"
                      src={blog.imagen}
                      alt="Imagen de blog"
                    />
                  </td>
                  <td>hola</td>
                  <td className="px-4 py-2 rounded-r-[34px]">
                    <div className="flex flex-row items-center justify-center gap-x-4">
                      <div className="">
                        <button 
                        //onClick={()=> handleEditarBlog(blog.idBlog)}
                        className="flex flex-col items-center justify-center hover:opacity-75"
                        >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="34px"
                          viewBox="0 -960 960 960"
                          width="34px"
                          fill="#634AE2"
                        >
                          <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
                        </svg>
                        <h1 className="font-light text-sm">Editar</h1>
                        </button>
                      </div>
                      <div className="">
                        <button
                          //onClick={()=> handleEliminarBlog(blog.idBlog)} 
                          className="flex flex-col items-center justify-center hover:opacity-75"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="34px"
                            viewBox="0 -960 960 960"
                            width="34px"
                            fill="#B158FF"
                          >
                            <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
                          </svg>
                          <h1 className="text-[#B158FF] font-light text-sm">
                            Eliminar
                          </h1>
                        </button>
                      </div>
                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    
}