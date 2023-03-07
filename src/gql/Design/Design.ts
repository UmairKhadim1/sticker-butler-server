import s3FetchURL from "../../utils/s3FetchURL"
export default {
    
    async mediaURLs(parent,args,context,info){
        let front=await s3FetchURL(parent.mediaURLs.front)
        let back=await s3FetchURL(parent.mediaURLs.back)
        return {
            front,back
        }
        

    }
}