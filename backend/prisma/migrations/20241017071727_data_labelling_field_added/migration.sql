-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "Data_Labelling_id" INTEGER;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "data_labelling_id" INTEGER;

-- CreateTable
CREATE TABLE "Data_Labelling" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT[],
    "Responses" JSONB NOT NULL DEFAULT '[{"id": "worker_id", "value": "Five_Star"}]',

    CONSTRAINT "Data_Labelling_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_data_labelling_id_fkey" FOREIGN KEY ("data_labelling_id") REFERENCES "Data_Labelling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_Data_Labelling_id_fkey" FOREIGN KEY ("Data_Labelling_id") REFERENCES "Data_Labelling"("id") ON DELETE SET NULL ON UPDATE CASCADE;
