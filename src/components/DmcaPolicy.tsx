
import React from 'react';

const DmcaPolicy: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300">
        <p className="lead text-lg">
            Natraj Rewards respects the intellectual property rights of others. We comply with the Digital Millennium Copyright Act ("DMCA") and other applicable intellectual property laws.
        </p>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="font-bold text-white text-xl mb-4">Notification of Infringement</h3>
            <p className="mb-4">
                If you believe that your work has been copied in a way that constitutes copyright infringement, please provide our Copyright Agent with the written information specified below:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest;</li>
                <li>A description of the copyrighted work that you claim has been infringed upon;</li>
                <li>A description of where the material that you claim is infringing is located on the site;</li>
                <li>Your address, telephone number, and e-mail address;</li>
                <li>A statement by you that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;</li>
                <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</li>
            </ul>
        </div>

        <div>
            <h3 className="font-bold text-white text-xl mb-4">Counter-Notification</h3>
            <p>
                If you believe that your Content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your Content, you may send a counter-notice containing the following information to the Copyright Agent:
            </p>
             <ul className="list-disc pl-6 space-y-2 text-sm mt-4">
                <li>Your physical or electronic signature;</li>
                <li>Identification of the Content that has been removed or to which access has been disabled and the location at which the Content appeared before it was removed or disabled;</li>
                <li>A statement that you have a good faith belief that the Content was removed or disabled as a result of mistake or a misidentification of the Content; and</li>
                <li>Your name, address, telephone number, and e-mail address, a statement that you consent to the jurisdiction of the federal court in San Francisco, California, and a statement that you will accept service of process from the person who provided notification of the alleged infringement.</li>
            </ul>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
             <h3 className="font-bold text-white text-xl mb-2">Contact Copyright Agent</h3>
             <p className="mb-2">DMCA notices should be sent to:</p>
             <div className="font-mono bg-black/30 p-4 rounded-lg inline-block text-nat-teal">
                legal@natrajrewards.com
             </div>
        </div>
    </div>
  );
};

export default DmcaPolicy;
