export default class ReviewService {
    private review: any;
    constructor(review: any) {
        this.review = review;
    }
    static async handlePostReviewOperations() {
        const user = await User.find({_id: this.review.user});
        const business = await Business.find({_id: this.review.business});
        // 1. classify review
        // 2. update user
        // 3. update business
        // 4. email user to update status
        await Mailmodule
    }

}
