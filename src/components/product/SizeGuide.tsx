 import { motion } from "framer-motion";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 
 const sizeData = [
   { size: "XS", us: "0-2", uk: "4-6", bust: "31-32", waist: "24-25", hip: "34-35" },
   { size: "S", us: "4-6", uk: "8-10", bust: "33-34", waist: "26-27", hip: "36-37" },
   { size: "M", us: "8-10", uk: "12-14", bust: "35-36", waist: "28-29", hip: "38-39" },
   { size: "L", us: "12-14", uk: "16-18", bust: "37-39", waist: "30-32", hip: "40-42" },
   { size: "XL", us: "16-18", uk: "20-22", bust: "40-42", waist: "33-35", hip: "43-45" },
   { size: "XXL", us: "20-22", uk: "24-26", bust: "43-45", waist: "36-38", hip: "46-48" },
 ];
 
 export function SizeGuide() {
   return (
     <section className="py-16 px-4 bg-muted/30">
       <div className="max-w-4xl mx-auto">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-10"
         >
           <h2 className="font-serif text-3xl text-foreground mb-4">Size Guide</h2>
           <p className="text-muted-foreground max-w-xl mx-auto">
             Find your perfect fit with our comprehensive size chart. All measurements are in inches.
           </p>
         </motion.div>
 
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.1 }}
           className="bg-background rounded-lg border overflow-hidden"
         >
           <Table>
             <TableHeader>
               <TableRow className="bg-muted/50">
                 <TableHead className="font-semibold text-foreground">Size</TableHead>
                 <TableHead className="font-semibold text-foreground">US</TableHead>
                 <TableHead className="font-semibold text-foreground">UK</TableHead>
                 <TableHead className="font-semibold text-foreground">Bust</TableHead>
                 <TableHead className="font-semibold text-foreground">Waist</TableHead>
                 <TableHead className="font-semibold text-foreground">Hip</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {sizeData.map((row, index) => (
                 <TableRow key={row.size} className={index % 2 === 0 ? "" : "bg-muted/20"}>
                   <TableCell className="font-medium">{row.size}</TableCell>
                   <TableCell>{row.us}</TableCell>
                   <TableCell>{row.uk}</TableCell>
                   <TableCell>{row.bust}"</TableCell>
                   <TableCell>{row.waist}"</TableCell>
                   <TableCell>{row.hip}"</TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </motion.div>
 
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="mt-8 grid md:grid-cols-3 gap-6 text-center"
         >
           <div className="bg-background p-6 rounded-lg border">
             <h3 className="font-serif text-lg text-foreground mb-2">Bust</h3>
             <p className="text-sm text-muted-foreground">
               Measure around the fullest part of your bust, keeping the tape parallel to the floor.
             </p>
           </div>
           <div className="bg-background p-6 rounded-lg border">
             <h3 className="font-serif text-lg text-foreground mb-2">Waist</h3>
             <p className="text-sm text-muted-foreground">
               Measure around your natural waistline, the narrowest part of your torso.
             </p>
           </div>
           <div className="bg-background p-6 rounded-lg border">
             <h3 className="font-serif text-lg text-foreground mb-2">Hip</h3>
             <p className="text-sm text-muted-foreground">
               Measure around the fullest part of your hips, approximately 8" below your waist.
             </p>
           </div>
         </motion.div>
       </div>
     </section>
   );
 }