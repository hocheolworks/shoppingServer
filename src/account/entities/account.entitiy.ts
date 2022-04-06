import { CoreEntity } from "src/common/entities/core.entity";
import OrderInfoEntity from "src/order/entities/order.entity";
import ReviewInfoEntity from "src/product/entities/review.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'account_info'})
class AccountInfoEntity extends CoreEntity {
    @Column()
    customerEmail: string;

    @Column()
    customerName: string;

    @Column()
    customerPassword: string;

    @Column()
    customerPhoneNumber: string;

    @Column({ nullable: true })
    custormerAddress: string;

    @Column({ nullable: true })
    signupVerifyToken: string;

    @Column({ default: 'USER' })
    userRole: string;

    @OneToMany(() => OrderInfoEntity, (order) => order.customer)
    orders: OrderInfoEntity[];

    @OneToMany(() => ReviewInfoEntity, (review) => review.customer)
    reviews: ReviewInfoEntity[];
}

export default AccountInfoEntity;