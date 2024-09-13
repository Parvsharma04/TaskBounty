-- DropForeignKey
ALTER TABLE "Payouts" DROP CONSTRAINT "Payouts_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Payouts" ADD CONSTRAINT "Payouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
