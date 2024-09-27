-- DropForeignKey
ALTER TABLE "MailingList" DROP CONSTRAINT "MailingList_countryId_fkey";

-- AddForeignKey
ALTER TABLE "MailingList" ADD CONSTRAINT "MailingList_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
